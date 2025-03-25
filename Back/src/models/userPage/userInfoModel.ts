import pool from "@config/db";

export interface info {
    uuid: string;
    nickName: string;
    profile: string;
    bio: string;
}

export const selectInfo = async (uuid: string): Promise<info | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        `SELECT 
            u.uuid,
            u.NICK_NAME as nickName, 
            p.profile,
            p.bio 
        FROM TB_USERS u
        LEFT JOIN TB_USER_PROFILES p ON u.UUID = p.UUID
        WHERE u.UUID = ?`, 
        [uuid]
    );
    conn.release();
    return rows.length ? rows[0] : null;
};
