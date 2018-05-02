package org.sunbird.support;

import android.os.Environment;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

public class SunbirdFileHandler {

    private static final String SUNBIRD_SUPPORT_DIRECTORY = "SunbirdSupport";
    private static final String SUNBIRD_SUPPORT_FILE = "sunbird_support.txt";
    private static final String SEPERATOR = "~";

    public static String makeEntryInSunbirdSupportFile(String packageName, String versionName) throws IOException {
        File genieSupportDirectory = SunbirdFileHandler.getRequiredDirectory(Environment.getExternalStorageDirectory(), SUNBIRD_SUPPORT_DIRECTORY);
        String filePath = genieSupportDirectory + "/" + SUNBIRD_SUPPORT_FILE;

        //for the first time when file does not exists
        if (!SunbirdFileHandler.checkIfFileExists(filePath)) {
            SunbirdFileHandler.createFileInTheDirectory(filePath);
            String firstEntry = versionName + SEPERATOR + System.currentTimeMillis() + SEPERATOR + "1";
            SunbirdFileHandler.saveToFile(filePath, firstEntry);
        } else {
            String lastLineOfFile = SunbirdFileHandler.readLastLineFromFile(filePath);
            if (!isNullOrEmpty(lastLineOfFile)) {
                String[] partsOfLastLine = lastLineOfFile.split(SEPERATOR);

                if (versionName.equalsIgnoreCase(partsOfLastLine[0])) {
                    //just remove the last line from the file and update it their
                    SunbirdFileHandler.removeLastLineFromFile(filePath);

                    String previousOpenCount = partsOfLastLine[2];
                    int count = Integer.parseInt(previousOpenCount);
                    count++;
                    String updateEntry = versionName + SEPERATOR + partsOfLastLine[1] + SEPERATOR + count;
                    SunbirdFileHandler.saveToFile(filePath, updateEntry);
                } else {
                    //make a new entry to the file
                    String newEntry = versionName + SEPERATOR + System.currentTimeMillis() + SEPERATOR + "1";
                    SunbirdFileHandler.saveToFile(filePath, newEntry);
                }
            } else {
                //make a new entry to the file
                String newEntry = versionName + SEPERATOR + System.currentTimeMillis() + SEPERATOR + "1";
                SunbirdFileHandler.saveToFile(filePath, newEntry);
            }
        }

        return filePath;
    }

    private static boolean isNullOrEmpty(String string) {
        return string == null || string.length() == 0;
    }


    public static File getRequiredDirectory(File externalFilesDir, String directoryName) {
        File directory = new File(externalFilesDir.getPath() + "/" + directoryName);

        if (!directory.isDirectory()) {
            directory.mkdirs();
        }
        return directory;
    }

    public static void removeLastLineFromFile(final String filePath) throws IOException {
        final List<String> lines = new LinkedList<String>();
        final Scanner reader = new Scanner(new FileInputStream(filePath), "UTF-8");
        while (reader.hasNextLine()) {
            lines.add(reader.nextLine().concat(System.getProperty("line.separator")));
        }
        reader.close();
        lines.remove(lines.size() - 1);
        final BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, false));
        for (final String line : lines)
            writer.write(line);
        writer.flush();
        writer.close();
    }

    public static boolean checkIfFileExists(String filePath) {
        File fileToCheck = new File(filePath);
        if (fileToCheck.exists()) {
            return true;
        }

        return false;
    }

    public static void createFileInTheDirectory(String filePath) {
        try {
            File f = new File(filePath);
            if (f.exists()) {
                f.delete();
            }
            f.createNewFile();

            FileOutputStream out = new FileOutputStream(f);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * Save the data to the file
     *
     * @param filePath
     * @param data
     */
    public static void saveToFile(String filePath, String data) {
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(filePath, true);
            fileOutputStream.write((data.concat(System.getProperty("line.separator"))).getBytes());
        } catch (FileNotFoundException ex) {
            System.out.print(ex.getMessage());
        } catch (IOException ex) {
            System.out.print(ex.getMessage());
        }
    }

    /**
     * Read last line from a given file
     *
     * @param filePath
     * @return
     */
    public static String readLastLineFromFile(String filePath) {
        String currentLine = null;
        String lastLine = null;

        try {
            FileInputStream fileInputStream = new FileInputStream(new File(filePath));
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            while ((currentLine = bufferedReader.readLine()) != null) {
                lastLine = currentLine;
            }
            fileInputStream.close();

            bufferedReader.close();
        } catch (FileNotFoundException ex) {
            System.out.print(ex.getMessage());
        } catch (IOException ex) {
            System.out.print(ex.getMessage());
        }
        return lastLine;
    }

}
