import mysql.connector
from mysql.connector import Error

def create_database_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',  # Replace with your MySQL username
            password=''    # Replace with your MySQL password
        )
        if connection.is_connected():
            print("Connected to MySQL server")
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

def create_database_and_table(connection):
    cursor = connection.cursor()
    
    try:
        # Create database if not exists
        cursor.execute("CREATE DATABASE IF NOT EXISTS user_db")
        cursor.execute("USE user_db")
        print("Database 'user_db' created or already exists")
        
        # Create user table
        cursor.execute("""
        DROP TABLE IF EXISTS `user`;
        CREATE TABLE `user` (
          `id` int NOT NULL AUTO_INCREMENT,
          `username` varchar(50) NOT NULL,
          `password` varchar(255) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        """)
        print("Table 'user' created")
        
        # Insert sample data
        cursor.execute("""
        INSERT INTO `user` VALUES (1,'admin','123');
        """)
        connection.commit()
        print("Sample data inserted")
        
    except Error as e:
        print(f"Error creating database or table: {e}")
    finally:
        cursor.close()

def query_users(connection):
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("USE user_db")
        cursor.execute("SELECT * FROM user")
        users = cursor.fetchall()
        
        print("\nUsers in database:")
        for user in users:
            print(f"ID: {user['id']}, Username: {user['username']}, Password: {user['password']}")
            
    except Error as e:
        print(f"Error querying users: {e}")
    finally:
        cursor.close()

def main():
    connection = create_database_connection()
    if connection:
        create_database_and_table(connection)
        query_users(connection)
        connection.close()
        print("\nDatabase setup complete. You can now work with it in VS Code.")

if __name__ == "__main__":
    main()