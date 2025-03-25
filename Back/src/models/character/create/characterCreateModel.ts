import pool from "@config/db";

export interface Lst {
  label: string;
  path: string;
  isRequired: boolean;
}

export const selectLst = async (cls: string, uuid: string): Promise<Lst | null> => {
  const conn = await pool.getConnection();
  try {
    let query: string;
    let params: any[];
    if (cls !== 'modl') {
      query = `
        SELECT label, path, is_required AS isRequired 
          FROM TB_CHARACTER_LST 
         WHERE CLASS = ? 
      ORDER BY ORDR
      `;
      params = [cls];
    } else {
      query = `
        SELECT lst.label, lst.path
          FROM TB_CHARACTER_LST lst
    INNER JOIN TB_USERS_API api 
            ON lst.SUB_CLASS = api.AI
         WHERE lst.CLASS = ? 
           AND api.UUID = ?
           AND api.CHECKED = TRUE
      ORDER BY ORDR
      `;
      params = [cls, uuid];
    }

    const rows = await conn.query(query, params);
    return rows.length ? rows : null;
  } finally {
    conn.release();
  }
};
