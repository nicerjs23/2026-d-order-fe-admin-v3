import { AxiosResponse } from 'axios';
import { instance } from './instance';
import {
  BoothMenuData,
  Menu,
  SetMenu,
  TableInfo,
} from '../pages/menu/Type/Menu_type';

export type MenuListCategoryV3 = 'FEE' | 'MENU' | 'DRINK' | 'SET';

export interface MenuListItemV3 {
  id: number | string;
  name: string;
  price: number;
  category: MenuListCategoryV3;
  description?: string | null;
  image: string | null;
  stock: number;
  is_soldout: boolean;
  is_fixed: boolean;
  set_items?: { menu_id: number; quantity: number; base_price: number; stock: number }[];
}

export interface MenuListResponseV3 {
  message: string;
  booth_id: number;
  data: MenuListItemV3[];
}

function mapV3MenuListToBoothMenuData(res: MenuListResponseV3): BoothMenuData {
  const { booth_id, data } = res;
  const table: TableInfo = {
    exists: false,
    price: 0,
    description: '',
  };
  const menus: Menu[] = [];
  const setmenus: SetMenu[] = [];

  for (const item of data) {
    const idNum = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;

    if (item.category === 'FEE' && item.is_fixed) {
      // description === 'FREE' 는 '받지 않음'(이용료 없음) 상태 (BE 규약)
      table.exists = item.description !== 'FREE';
      table.price = item.price;
      table.description = item.description ?? '';
      continue;
    }

    if (item.category === 'MENU' || item.category === 'DRINK') {
      const menuCategory = item.category === 'MENU' ? '메뉴' : '음료';
      menus.push({
        menu_id: idNum,
        booth_id,
        menu_name: item.name,
        menu_description: item.description ?? '',
        menu_category: menuCategory,
        menu_price: item.price,
        menu_amount: item.stock,
        menu_image: item.image ?? '',
        is_sold_out: item.is_soldout,
      });
      continue;
    }

    if (item.category === 'SET') {
      setmenus.push({
        set_menu_id: idNum,
        booth_id,
        set_category: 'SET',
        set_name: item.name,
        set_description: item.description ?? '',
        set_image: item.image ?? '',
        set_price: item.price,
        origin_price: item.price,
        is_sold_out: item.is_soldout,
        menu_items: (item.set_items ?? []).map((si) => ({ menu_id: si.menu_id, quantity: si.quantity })),
      });
    }
  }

  return { booth_id, table, menus, setmenus };
}

interface CreateMenuResponse {
  data: Menu;
}

const MenuService = {
  // 메뉴 리스트 조회
  getMenuList: async (): Promise<BoothMenuData> => {
    try {
      const response = await instance.get<MenuListResponseV3>(
        '/api/v3/django/booth/menu-list/',
      );
      /* console.log('메뉴 리스트 응답:', response.data); */
      return mapV3MenuListToBoothMenuData(response.data);
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 생성
  createMenu: async (formData: FormData): Promise<Menu> => {
    try {
      const response: AxiosResponse<CreateMenuResponse> = await instance.post(
        '/api/v3/django/booth/menus/',
        formData,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 수정
  updateMenu: async (id: number, formData: FormData): Promise<Menu> => {
    try {
      const response: AxiosResponse<{ data: Menu }> = await instance.patch(
        `/api/v3/django/booth/menus/${id}/`,
        formData,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // 메뉴 삭제 — v2→v3
  deleteMenu: async (id: number) => {
    try {
      await instance.delete(`/api/v3/django/booth/menus/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 생성
  createSettMenu: async (payload: {
    name: string;
    description: string;
    price: number | string;
    set_items: { menu_id: number; quantity: number }[];
  }): Promise<void> => {
    try {
      await instance.post(`/api/v3/django/booth/sets/`, payload);
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 수정
  // 이미지 수정 불가, 삭제만 image_delete: true 로 가능
  editSetMenu: async (
    set_menu_id: number,
    payload: {
      name?: string;
      description?: string | null;
      price?: number;
      set_items?: { menu_id: number; quantity: number }[];
      image_delete?: boolean;
    },
  ): Promise<void> => {
    try {
      await instance.patch(
        `/api/v3/django/booth/sets/${set_menu_id}/`,
        payload,
      );
    } catch (error) {
      throw error;
    }
  },

  // 세트메뉴 삭제
  deleteSetMenu: async (id: number): Promise<void> => {
    try {
      await instance.delete(`/api/v3/django/booth/sets/${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

export default MenuService;
