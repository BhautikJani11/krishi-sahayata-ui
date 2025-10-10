from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Literal
import httpx
import os

router = APIRouter()

Language = Literal["en", "hi", "gu"]

class WeatherAlert(BaseModel):
    severity: Literal["low", "medium", "high"]
    message: str
    icon: str

class WeatherResponse(BaseModel):
    title: str
    alerts: List[WeatherAlert]

class Scheme(BaseModel):
    name: str
    description: str

class SchemesResponse(BaseModel):
    title: str
    apply_label: str
    schemes: List[Scheme]

class Tip(BaseModel):
    icon: str
    title: str
    description: str

class TipsResponse(BaseModel):
    title: str
    read_more_label: str
    tips: List[Tip]


TRANSLATIONS = {
    "en": {
        "weather": {
            "title": "Weather Alerts",
            "alerts": [
                {"severity": "high", "message": "Heavy rainfall expected in next 48 hours", "icon": "CloudRain"},
                {"severity": "medium", "message": "Strong winds warning for tomorrow", "icon": "AlertTriangle"},
                {"severity": "low", "message": "Sunny weather for next 5 days", "icon": "Sun"},
            ],
        },
        "schemes": {
            "title": "Government Schemes",
            "apply": "Apply Now",
            "schemes": [
                {"name": "PM-KISAN", "description": "Direct income support of ₹6,000 per year to farmer families. Three installments of ₹2,000 each."},
                {"name": "Soil Health Card Scheme", "description": "Free soil testing to help farmers improve productivity through balanced use of fertilizers."},
                {"name": "Pradhan Mantri Fasal Bima Yojana", "description": "Crop insurance scheme providing financial support against crop loss due to natural calamities."},
            ],
        },
        "tips": {
            "title": "Farming Tips",
            "read_more": "Read More",
            "tips": [
                {"icon": "Sprout", "title": "Crop Rotation", "description": "Improve soil health by rotating crops each season."},
                {"icon": "Wheat", "title": "Wheat Sowing", "description": "Best practices for winter wheat cultivation and timing."},
                {"icon": "Droplets", "title": "Irrigation Tips", "description": "Efficient water management for better yields."},
                {"icon": "Bug", "title": "Pest Control", "description": "Natural and organic pest management techniques."},
            ],
        },
    },
    "hi": {
        "weather": {
            "title": "मौसम चेतावनी",
            "alerts": [
                {"severity": "high", "message": "अगले 48 घंटों में भारी बारिश की उम्मीद", "icon": "CloudRain"},
                {"severity": "medium", "message": "कल तेज हवाओं की चेतावनी", "icon": "AlertTriangle"},
                {"severity": "low", "message": "अगले 5 दिनों के लिए धूप का मौसम", "icon": "Sun"},
            ],
        },
        "schemes": {
            "title": "सरकारी योजनाएं",
            "apply": "अभी आवेदन करें",
            "schemes": [
                {"name": "पीएम-किसान", "description": "किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता। ₹2,000 की तीन किस्तें।"},
                {"name": "मृदा स्वास्थ्य कार्ड योजना", "description": "उर्वरकों के संतुलित उपयोग के माध्यम से किसानों को उत्पादकता में सुधार करने में मदद के लिए मुफ्त मिट्टी परीक्षण।"},
                {"name": "प्रधानमंत्री फसल बीमा योजना", "description": "प्राकृतिक आपदाओं के कारण फसल नुकसान के खिलाफ वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।"},
            ],
        },
        "tips": {
            "title": "खेती टिप्स",
            "read_more": "और पढ़ें",
            "tips": [
                {"icon": "Sprout", "title": "फसल चक्र", "description": "प्रत्येक मौसम में फसलों को घुमाकर मिट्टी के स्वास्थ्य में सुधार करें।"},
                {"icon": "Wheat", "title": "गेहूं की बुवाई", "description": "सर्दियों में गेहूं की खेती और समय के लिए सर्वोत्तम प्रथाएं।"},
                {"icon": "Droplets", "title": "सिंचाई टिप्स", "description": "बेहतर उपज के लिए कुशल जल प्रबंधन।"},
                {"icon": "Bug", "title": "कीट नियंत्रण", "description": "प्राकृतिक और जैविक कीट प्रबंधन तकनीक।"},
            ],
        },
    },
    "gu": {
        "weather": {
            "title": "હવામાન ચેતવણીઓ",
            "alerts": [
                {"severity": "high", "message": "આગામી 48 કલાકમાં ભારે વરસાદની અપેક્ષા", "icon": "CloudRain"},
                {"severity": "medium", "message": "આવતીકાલ માટે તેજ પવનની ચેતવણી", "icon": "AlertTriangle"},
                {"severity": "low", "message": "આગામી 5 દિવસ માટે સની હવામાન", "icon": "Sun"},
            ],
        },
        "schemes": {
            "title": "સરકારી યોજનાઓ",
            "apply": "હમણાં અરજી કરો",
            "schemes": [
                {"name": "પીએમ-કિસાન", "description": "ખેડૂત પરિવારોને દર વર્ષે ₹6,000 ની સીધી આવક સહાય. ₹2,000 ની ત્રણ હપ્તા."},
                {"name": "માટી આરોગ્ય કાર્ડ યોજના", "description": "ખાતરના સંતુલિત ઉપયોગ દ્વારા ખેડૂતોને ઉત્પાદકતા સુધારવામાં મદદ કરવા માટે મફત માટી પરીક્ષણ."},
                {"name": "પ્રધાનમંત્રી ફસલ વીમા યોજના", "description": "કુદરતી આફતોને કારણે પાકના નુકસાન સામે નાણાકીય સહાય પૂરી પાડતી પાક વીમા યોજના."},
            ],
        },
        "tips": {
            "title": "ખેતી ટીપ્સ",
            "read_more": "વધુ વાંચો",
            "tips": [
                {"icon": "Sprout", "title": "પાક પરિભ્રમણ", "description": "દરેક મોસમમાં પાકોને ફેરવીને જમીનના સ્વાસ્થ્યમાં સુધારો કરો."},
                {"icon": "Wheat", "title": "ઘઉંની વાવણી", "description": "શિયાળુ ઘઉંની ખેતી અને સમય માટે શ્રેષ્ઠ પ્રથાઓ."},
                {"icon": "Droplets", "title": "સિંચાઈ ટીપ્સ", "description": "વધુ સારી ઉપજ માટે કાર્યક્ષમ પાણી વ્યવસ્થાપન."},
                {"icon": "Bug", "title": "જીવાત નિયંત્રણ", "description": "કુદરતી અને કાર્બનિક જીવાત વ્યવસ્થાપન તકનીકો."},
            ],
        },
    },
}


@router.get("/weather", response_model=WeatherResponse)
async def get_weather(language: Language = Query("en")):
    t = TRANSLATIONS.get(language, TRANSLATIONS["en"])  # default to en
    w = t["weather"]
    return WeatherResponse(title=w["title"], alerts=w["alerts"])  # type: ignore


@router.get("/schemes", response_model=SchemesResponse)
async def get_schemes(language: Language = Query("en")):
    t = TRANSLATIONS.get(language, TRANSLATIONS["en"])  # default to en
    s = t["schemes"]
    return SchemesResponse(title=s["title"], apply_label=s["apply"], schemes=s["schemes"])  # type: ignore


@router.get("/tips", response_model=TipsResponse)
async def get_tips(language: Language = Query("en")):
    t = TRANSLATIONS.get(language, TRANSLATIONS["en"])  # default to en
    tips = t["tips"]
    return TipsResponse(title=tips["title"], read_more_label=tips["read_more"], tips=tips["tips"])  # type: ignore
