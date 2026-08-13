import pymysql

try:
    conn = pymysql.connect(host='127.0.0.1', user='root', password='', port=3307)
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS hireai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.commit()
    conn.close()
    print("PORT_3307_SUCCESS_HIREAI_DB_CREATED")
except Exception as e:
    print(f"PORT_3307_FAILED: {e}")
