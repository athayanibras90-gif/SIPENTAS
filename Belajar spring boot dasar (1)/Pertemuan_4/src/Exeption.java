public class Exeption {
    public static void main(String[] args) {

        try {
            int hasil = 10 / 100;
        } catch (Exception e) {
            System.out.println("Terjadi error");
            System.out.println(e.getMessage());
            e.getStackTrace();


            throw new RuntimeException("tes");
        } finally {
            System.out.println("Program selesai");
        }

    }
}
