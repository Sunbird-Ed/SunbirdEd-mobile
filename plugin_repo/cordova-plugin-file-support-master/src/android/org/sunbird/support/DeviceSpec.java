package org.sunbird.support;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Point;
import android.hardware.Camera;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.Settings;
import android.support.v4.content.ContextCompat;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by swayangjit on 25/5/17.
 * Edited by Subranil on 31/10/18.
 */

public class DeviceSpec {

    /**
     * Capitalizes the input String
     *
     * @param s
     * @return String
     */
    private static String capitalize(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }

        char first = s.charAt(0);
        if (Character.isUpperCase(first)) {
            return s;
        } else {
            return Character.toUpperCase(first) + s.substring(1);
        }
    }

    private static Integer[] setRealDeviceSizeInPixels(WindowManager wm) {
        Display display = wm.getDefaultDisplay();
        DisplayMetrics displayMetrics = new DisplayMetrics();
        display.getMetrics(displayMetrics);
        Integer[] coordinates = new Integer[2];

        // since SDK_INT = 1;
        int widthPixels = displayMetrics.widthPixels;
        int heightPixels = displayMetrics.heightPixels;

        // includes window decorations (statusbar bar/menu bar)
        if (Build.VERSION.SDK_INT >= 14 && Build.VERSION.SDK_INT < 17) {
            try {
                widthPixels = (Integer) Display.class.getMethod("getRawWidth").invoke(display);
                heightPixels = (Integer) Display.class.getMethod("getRawHeight").invoke(display);
            } catch (Exception ignored) {
            }
        }

        // includes window decorations (statusbar bar/menu bar)
        if (Build.VERSION.SDK_INT >= 17) {
            try {
                Point realSize = new Point();
                Display.class.getMethod("getRealSize", Point.class).invoke(display, realSize);
                widthPixels = realSize.x;
                heightPixels = realSize.y;
            } catch (Exception ignored) {
            }
        }

        coordinates[0] = widthPixels;
        coordinates[1] = heightPixels;

        return coordinates;
    }

    public static String getOSVersion() {
        return Build.VERSION.RELEASE;
    }

    public static String getDeviceName() {
        String manufacturer = getDeviceMaker();
        String model = getDeviceModel();
        if (model.startsWith(manufacturer)) {
            return model;
        } else {
            return capitalize(manufacturer) + " " + model;
        }
    }

    public static String getDeviceMaker() {
        return Build.MANUFACTURER;
    }

    public static String getDeviceModel() {
        return Build.MODEL;
    }

    public static int getDeviceDensityInDpi(Context context) {
        DisplayMetrics dm = context.getResources().getDisplayMetrics();
        return dm.densityDpi;
    }

    public static String getAndroidId(Context context) {
        String androidId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
        return androidId;
    }

    public static boolean hasExternalSDCard(Context context) {
        File[] storages = ContextCompat.getExternalFilesDirs(context, null);
        if (storages.length > 1 && storages[0] != null && storages[1] != null) {
            return true;
        } else {
            return false;
        }
    }

    public static long getTotalRAM(Context context) {
        long totalMemory = 0;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            ActivityManager.MemoryInfo mi = new ActivityManager.MemoryInfo();
            ActivityManager activityManager = (ActivityManager) context.getSystemService(Activity.ACTIVITY_SERVICE);
            activityManager.getMemoryInfo(mi);
            return mi.totalMem;
        }
        try {
            RandomAccessFile reader = new RandomAccessFile("/proc/meminfo", "r");
            String load = reader.readLine().replaceAll("\\D+", "");
            totalMemory = (long) Integer.parseInt(load);
            reader.close();
            return totalMemory;
        } catch (IOException e) {
            e.printStackTrace();
            return 0l;
        }
    }

    public static long getAvailableInternalMemorySize() {
        File path = Environment.getDataDirectory();
        StatFs stat = new StatFs(path.getPath());
        long blockSize, availableBlocks;

        blockSize = stat.getBlockSizeLong();
        availableBlocks = stat.getAvailableBlocksLong();

        return availableBlocks * blockSize;
    }

    public static long getTotalInternalMemorySize() {
        File path = Environment.getDataDirectory();
        StatFs stat = new StatFs(path.getPath());
        long blockSize;
        long totalBlocks;

        blockSize = stat.getBlockSizeLong();
        totalBlocks = stat.getBlockCountLong();

        return totalBlocks * blockSize;
    }

    public static long getAvailableExternalMemorySize(Context context) {
        if (hasExternalSDCard(context)) {
            File path = Environment.getExternalStorageDirectory();
            StatFs stat = new StatFs(path.getPath());
            long blockSize;
            long availableBlocks;
            blockSize = stat.getBlockSizeLong();
            availableBlocks = stat.getAvailableBlocksLong();

            return availableBlocks * blockSize;
        } else
            return 0;
    }

    public static long getTotalExternalMemorySize(Context context) {
        if (hasExternalSDCard(context)) {
            File path = Environment.getExternalStorageDirectory();
            StatFs stat = new StatFs(path.getPath());
            long blockSize;
            long totalBlocks;
            blockSize = stat.getBlockSizeLong();
            totalBlocks = stat.getBlockCountLong();

            return totalBlocks * blockSize;
        } else
            return 0;
    }

    public static int getScreenHeight(Context context) {
        int height = 0;
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();
        if (Build.VERSION.SDK_INT > 12) {
            Point size = new Point();
            display.getSize(size);
            height = size.y;
        } else {
            height = display.getHeight();  // deprecated
        }
        return height;
    }

    public static int getScreenWidth(Context context) {
        int width = 0;
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();
        if (Build.VERSION.SDK_INT > 12) {
            Point size = new Point();
            display.getSize(size);
            width = size.x;
        } else {
            width = display.getWidth();  // deprecated
        }
        return width;
    }

    public static String getScreenInfoinInch(Context context) {
        DisplayMetrics dm = new DisplayMetrics();
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        wm.getDefaultDisplay().getMetrics(dm);
        Integer[] coordinates = setRealDeviceSizeInPixels(wm);
        double x = Math.pow(coordinates[0] / dm.xdpi, 2);
        double y = Math.pow(coordinates[1] / dm.ydpi, 2);
        double screenInches = Math.sqrt(x + y);
        double roundOff = Math.round(screenInches * 100.0) / 100.0;
        return String.valueOf(roundOff);
    }

    public static String[] getCameraInfo(Context context) {
        String[] cameraInfo = null;
        double backCamerapixel = 0;
        double frontCamerapixel = 0;
        try {
            PackageManager packageManager = context.getPackageManager();
            backCamerapixel = getCameraPixel(Camera.open(0));
            if (packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FRONT)) {
                frontCamerapixel = getCameraPixel(Camera.open(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

            if (backCamerapixel != 0 && frontCamerapixel == 0) {
                cameraInfo = new String[1];
                cameraInfo[0] = String.valueOf(backCamerapixel);
            } else if (frontCamerapixel != 0 && backCamerapixel == 0) {
                cameraInfo = new String[1];
                cameraInfo[0] = String.valueOf(frontCamerapixel);
            } else if (frontCamerapixel != 0 && backCamerapixel != 0) {
                cameraInfo = new String[2];
                cameraInfo[0] = String.valueOf(backCamerapixel);
                cameraInfo[1] = String.valueOf(frontCamerapixel);
            }
        }

        return cameraInfo;
    }

    private static double getCameraPixel(Camera camera) {
        double camerapixel = 0;
        android.hardware.Camera.Parameters params = camera.getParameters();
        List sizes = params.getSupportedPictureSizes();
        Camera.Size result;

        ArrayList<Integer> widthList = new ArrayList<Integer>();
        ArrayList<Integer> heightList = new ArrayList<Integer>();

        for (int i = 0; i < sizes.size(); i++) {
            result = (Camera.Size) sizes.get(i);
            widthList.add(result.width);
            heightList.add(result.height);
        }

        if (widthList.size() != 0 && heightList.size() != 0) {
            double backmegapixel1 = ((Collections.max(widthList)) * (Collections.max(heightList)));
            double as = backmegapixel1 / 1000000;

            camerapixel = Math.round(as * 100.0) / 100.0;
        }

        camera.release();

        widthList.clear();
        heightList.clear();

        return Math.ceil(camerapixel);
    }

    public static String getCpuInfo() {
        StringBuffer sb = new StringBuffer();
        sb.append("abi: ").append(Build.CPU_ABI).append("\n");
        if (new File("/proc/cpuinfo").exists()) {
            try {
                BufferedReader br = new BufferedReader(new FileReader(new File("/proc/cpuinfo")));
                String aLine;
                while ((aLine = br.readLine()) != null) {
                    sb.append(aLine + "\n");
                    break;
                }

                if (br != null) {
                    br.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return sb.toString().replace(System.getProperty("line.separator"), " ").replace("Processor	:", "");
    }
    
}