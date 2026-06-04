import java.util.*;


public class Mahasiswa {
    private static Object dataSet;

    public static void main(String[] args) {
        String mhs1 = "budi";
        String mhs2 = "joko";

        String[] mhs = {"joko", "budi", "erpan"};
        List <String> mhs4 = new ArrayList<>();
        mhs4.add("joko");
        mhs4.add("budi");
        mhs4.add("erpan");


        System.out.println("Data List: "+ mhs4);

        Set<String> dataSet1 = new HashSet<>();
        dataSet1.add("joko");
        dataSet1.add("budi");
        dataSet1.add("erpan");

        dataSet1.remove("budi");

        System.out.println("Data Set: "+ dataSet1);

        Map<String, Integer> stokBuah = new HashMap<>();
        stokBuah.put("apel", 50);
        stokBuah.put("mangga", 150);

        stokBuah.remove("apel");

        System.out.println("Stok apel: " + stokBuah.get("apel"));
        System.out.println("Stok apel: " + stokBuah.get("mangga"));

    }

}
