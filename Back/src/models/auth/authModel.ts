import pool from "@config/db";

interface User {
  uid: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM TB_USERS WHERE email = ?", [email]);
  conn.release();
  return rows.length ? rows[0] : null;
};

export const findUserByNickName = async (nickName: string): Promise<User | null> => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM TB_USERS WHERE nick_name = ?", [nickName]);
  conn.release();
  return rows.length ? rows[0] : null;
};

export const  createUser = async (name: string, email: string, nickName: string, birthday: string, agent: string, pw?: string ): Promise<void> => {
  const conn = await pool.getConnection();
  const query = pw ? 
    "INSERT INTO TB_USERS (NAME, EMAIL, NICK_NAME, BIRTHDAY, PASSWORD, AUTH_AGENT) values (?, ?, ?, ?, SHA2(?, 256), ?)" :
    "INSERT INTO TB_USERS (NAME, EMAIL, NICK_NAME, BIRTHDAY, PASSWORD, AUTH_AGENT) values (?, ?, ?, ?, NULL, 'local')";

  const params = pw ? [name, email, nickName, birthday, pw, agent] : [name, email, nickName, birthday];

  await conn.query(query, params);
  conn.release();
};

export const loginUser = async (email: string, pw: string): Promise<User | null> => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM TB_USERS WHERE 1=1 AND EMAIL = ? AND PASSWORD = SHA2(?, 256)", [email, pw]);
  conn.release();
  return rows.length ? rows[0] : null;
};

export const authUser = async (uid: string, token: string): Promise<void> => {
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO TB_AUTH_USERS (UID, TOKEN) values (?, ?)", [uid, token]);
  conn.release();
};

export const findNickname = async (nickName: string): Promise<User | null> => {
  const conn = await pool.getConnection();

  const rows = await conn.query("SELECT * FROM TB_USERS WHERE nick_name = ?", [nickName]);
  conn.release();
  return rows.length ? rows[0] : null;
};

export const getMyUser =async (uid: string): Promise<User | null> => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    `SELECT
            u.uid, 
            u.nick_name as nickName, 
            p.PROFILE AS profileUrl 
       FROM TB_USERS u 
  LEFT JOIN TB_USER_PROFILES p 
         ON u.UID = p.UID 
      WHERE u.uid = ?`,
     [uid]);
  conn.release();
  return rows.length ? rows[0] : null;
};