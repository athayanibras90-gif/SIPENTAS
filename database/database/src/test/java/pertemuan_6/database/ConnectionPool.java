package pertemuan_6.database;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

public class ConnectionPool {
    @Test
    void testHikariCP() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306/belajar_java_database");
        config.setUsername("root");
        config.setPassword("");

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(60_000);
        config.setMaxLifetime(10 * 60_000);

        try {
            HikariDataSource dataSource = new HikariDataSource(config);
            Connection connection = dataSource.getConnection();
            System.out.println("Sukses mengambil connection dari pool");
            
            connection.close();
            System.out.println("Sukses mengembalikan connection ke pool");
            
            dataSource.close();
            System.out.println("Sukses menutup data source");
        } catch (SQLException e) {
            Assertions.fail(e);
        }
    }
}
