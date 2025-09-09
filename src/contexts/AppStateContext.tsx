import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Page {
  id: string;
  name: string;
  html: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  category: string;
  image: string;
  stock: number;
}

export interface Order {
  id: string;
  date: number;
  customer: string;
  product: string;
  qty: number;
  total: number;
  method: 'WA' | 'Transfer' | 'QRIS';
  status: 'Pending' | 'Paid' | 'Canceled';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  note: string;
}

export interface Media {
  id: string;
  name: string;
  dataUrl: string;
}

export interface CRMCard {
  id: string;
  name: string;
  note: string;
  stage: 'To Contact' | 'In Progress' | 'Won' | 'Lost';
}

export interface AppSettings {
  brandName: string;
  domain: string;
  workspace: string;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  logo: string;
  favicon: string;
  waNumber: string;
  waTemplate: string;
  bankInfo: string;
  qrisId: string;
  qrisImg: string;
}

export interface AppState {
  pages: Page[];
  currentPageId: string;
  selectedElement: HTMLElement | null;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  media: Media[];
  settings: AppSettings;
  apps: {
    crm: boolean;
    rekap: boolean;
    db: boolean;
  };
  crm: {
    cards: CRMCard[];
  };
  currentView: string;
  sidebarOpen: boolean;
}

// Actions
type AppAction = 
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'ADD_PAGE'; payload: { id: string; name: string } }
  | { type: 'UPDATE_PAGE_HTML'; payload: { id: string; html: string } }
  | { type: 'SELECT_ELEMENT'; payload: HTMLElement | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { index: number; product: Product } }
  | { type: 'DELETE_PRODUCT'; payload: number }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { index: number; order: Order } }
  | { type: 'DELETE_ORDER'; payload: number }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'ADD_MEDIA'; payload: Media }
  | { type: 'DELETE_MEDIA'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_CRM_CARD'; payload: CRMCard }
  | { type: 'UPDATE_CRM_CARD'; payload: { id: string; updates: Partial<CRMCard> } }
  | { type: 'TOGGLE_APP'; payload: { app: keyof AppState['apps']; enabled: boolean } }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_STATE'; payload: AppState };

// Default state
const defaultState = (): AppState => ({
  pages: [{ id: 'home', name: 'Beranda', html: '' }],
  currentPageId: 'home',
  selectedElement: null,
  products: [],
  orders: [],
  customers: [],
  media: [],
  settings: {
    brandName: 'Page Builder',
    domain: '',
    workspace: 'default',
    theme: 'dark',
    lang: 'id',
    logo: '',
    favicon: '',
    waNumber: '',
    waTemplate: 'Halo, saya ingin beli {{product}} ({{qty}}x) total {{total}}.',
    bankInfo: '',
    qrisId: '',
    qrisImg: ''
  },
  apps: {
    crm: false,
    rekap: false,
    db: true
  },
  crm: {
    cards: []
  },
  currentView: 'builder',
  sidebarOpen: true
});

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageId: action.payload };
    
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, { ...action.payload, html: '' }]
      };
    
    case 'UPDATE_PAGE_HTML':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.id
            ? { ...page, html: action.payload.html }
            : page
        )
      };
    
    case 'SELECT_ELEMENT':
      return { ...state, selectedElement: action.payload };
    
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product, index) =>
          index === action.payload.index ? action.payload.product : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((_, index) => index !== action.payload)
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map((order, index) =>
          index === action.payload.index ? action.payload.order : order
        )
      };
    
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter((_, index) => index !== action.payload)
      };
    
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    
    case 'ADD_MEDIA':
      return {
        ...state,
        media: [...state.media, action.payload]
      };
    
    case 'DELETE_MEDIA':
      return {
        ...state,
        media: state.media.filter(m => m.id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'ADD_CRM_CARD':
      return {
        ...state,
        crm: {
          ...state.crm,
          cards: [...state.crm.cards, action.payload]
        }
      };
    
    case 'UPDATE_CRM_CARD':
      return {
        ...state,
        crm: {
          ...state.crm,
          cards: state.crm.cards.map(card =>
            card.id === action.payload.id
              ? { ...card, ...action.payload.updates }
              : card
          )
        }
      };
    
    case 'TOGGLE_APP':
      return {
        ...state,
        apps: {
          ...state.apps,
          [action.payload.app]: action.payload.enabled
        }
      };
    
    case 'RESET_STATE':
      return defaultState();
    
    case 'LOAD_STATE':
      return { ...defaultState(), ...action.payload };
    
    default:
      return state;
  }
}

// Context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, defaultState());
  
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Hook
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}