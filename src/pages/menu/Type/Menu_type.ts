export type TableInfo = {
  exists: boolean; // FEE 항목 존재 여부 (없으면 이용료 없음 = SOLD OUT)
  price: number;
  description: string; // 기준 (예: "테이블")
};

export interface Menu {
  menu_id: number;
  booth_id: number;
  menu_name: string;
  menu_description: string;
  menu_category: string;
  menu_price: number;
  menu_amount: number;
  menu_image: string;
  is_selling?: boolean;
  is_sold_out?: boolean;
}

export interface SetMenu {
  set_menu_id: number;
  booth_id: number;
  set_category: string;
  set_name: string;
  set_description: string;
  set_image: string;
  set_price: number;
  origin_price: number;
  is_sold_out?: boolean;
  menu_items: { menu_id: number; quantity: number }[];
}
export type BoothMenuData = {
  booth_id: number;
  table?: TableInfo; // 없을 수도 있음
  menus: Menu[];
  setmenus: SetMenu[];
};
