/**
 * API client for FastAPI backend
 */

const API_BASE_URL = '/api/v1';  // Relative—uses Vite proxy

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_id?: string;
  language?: string;
}

export interface ChatResponse {
  conversation_id: string;
  message: string;
  role: string;
  created_at: string;
}

export interface WeatherRequest {
  location?: string;
  language?: string;
}

export interface WeatherAlert {
  id?: string;
  location: string;
  severity: string;
  message_en: string;
  message_hi?: string;
  message_gu?: string;
  alert_type?: string;
  icon?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  rainfall?: number;
}

export interface Scheme {
  id: string;
  name_en: string;
  name_hi?: string;
  name_gu?: string;
  description_en: string;
  description_hi?: string;
  description_gu?: string;
  application_url?: string;
  category?: string;
  is_active: boolean;
}

export interface Tip {
  id: string;
  title_en: string;
  title_hi?: string;
  title_gu?: string;
  description_en: string;
  description_hi?: string;
  description_gu?: string;
  category?: string;
  icon?: string;
  is_active: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chat endpoints
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Weather endpoints
  async getWeatherAlerts(request: WeatherRequest): Promise<WeatherAlert[]> {
    return this.request<WeatherAlert[]>('/weather/alerts', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCurrentWeather(location: string = 'Delhi,IN') {
    return this.request(`/weather/current?location=${encodeURIComponent(location)}`, {
      method: 'GET',
    });
  }

  // Schemes endpoints
  async getSchemes(language: string = 'en', activeOnly: boolean = true): Promise<Scheme[]> {
    // Use query params without trailing slash to avoid redirects
    return this.request<Scheme[]>(
      `/schemes?language=${encodeURIComponent(language)}&active_only=${activeOnly}`,
      { method: 'GET' }
    );
  }

  async getScheme(id: string): Promise<Scheme> {
    return this.request<Scheme>(`/schemes/${id}`, { method: 'GET' });
  }

  // Tips endpoints
  async getTips(
    language: string = 'en',
    category?: string,
    season?: string,
    activeOnly: boolean = true
  ): Promise<Tip[]> {
    // Build URL with optional filters; avoid trailing slash
    let url = `/tips?language=${encodeURIComponent(language)}&active_only=${activeOnly}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (season) url += `&season=${encodeURIComponent(season)}`;

    return this.request<Tip[]>(url, { method: 'GET' });
  }

  async getTip(id: string): Promise<Tip> {
    return this.request<Tip>(`/tips/${id}`, { method: 'GET' });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { method: 'GET' });
  }
}

export const apiClient = new APIClient();