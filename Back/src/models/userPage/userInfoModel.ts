import pool from "@config/db";

export interface info {
    uid: string;
    nickName: string;
    profile: string;
    bio: string;
}

export const selectInfo = async (uid: string): Promise<info | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query(
        `SELECT 
            u.uid,
            u.NICK_NAME as nickName, 
            p.profile,
            p.bio 
        FROM TB_USERS u
        LEFT JOIN TB_USER_PROFILES p ON u.UID = p.UID
        WHERE u.UID = ?`, 
        [uid]
    );
    conn.release();
    return rows.length ? rows[0] : null;
};
