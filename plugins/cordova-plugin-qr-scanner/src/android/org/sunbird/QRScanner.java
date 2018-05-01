package org.sunbird;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.google.zxing.ResultPoint;
import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.sunbird.app.R;

import java.util.List;

/**
 * @author vinayagasundar
 */
public class QRScanner extends CordovaPlugin {
    
    
    private static final String ACTION_QR_SCANNER = "qrScanner";

    private static final String START_SCANNING = "startScanner";
    private static final String STOP_SCANNING = "stopScanner";

    private Dialog mScanDialog = null;


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals(ACTION_QR_SCANNER)) {
            String type = args.getString(0);
            
            switch (type) {
                case START_SCANNING:
                    showScanDialog(args, callbackContext);
                    break;
                    
                case STOP_SCANNING:
                    stopScanner(callbackContext);
                    break;
            }
        }
        
        return true;
    }


    private void showScanDialog(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        stopScanner(null);
        
        if (cordova.getActivity().isFinishing()) {
            return;
        }


        Log.i("hello", cordova.getActivity().getPackageName());

        String title = args.optString(1, "Scan QR Code");

        String displayText = args.optString(1, "Scan the QR code with your phone camera");
        String color = args.optString(3, "#0000ff");
        
        
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Context context = webView.getContext();

                View view = LayoutInflater.from(context).inflate(R.layout.qr_scanner_dialog, null);

                Toolbar toolbar = view.findViewById(R.id.toolbar);
                toolbar.setTitle(title);

                toolbar.setNavigationIcon(R.drawable.ic_action_arrow_left);
                toolbar.setNavigationOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        stopScanner(callbackContext);
                    }
                });

                DecoratedBarcodeView decoratedBarcodeView = view.findViewById(R.id.qr_scanner);
                TextView titleTextView = view.findViewById(R.id.display_text);
                decoratedBarcodeView.setStatusText(null);

                titleTextView.setText(displayText);
                titleTextView.setTextColor(Color.parseColor(color));

                decoratedBarcodeView.decodeSingle(new BarcodeCallback() {
                    @Override
                    public void barcodeResult(BarcodeResult result) {
                        Log.i("QRScanner", "barcodeResult: " + result.getText());
                        decoratedBarcodeView.pause();
                        callbackContext.success(result.getText());
                    }

                    @Override
                    public void possibleResultPoints(List<ResultPoint> resultPoints) {

                    }
                });

                mScanDialog = new Dialog(context, android.R.style.Theme_Translucent_NoTitleBar);

                if ((cordova.getActivity().getWindow().getAttributes().flags & WindowManager.LayoutParams.FLAG_FULLSCREEN)
                        == WindowManager.LayoutParams.FLAG_FULLSCREEN) {
                    mScanDialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                            WindowManager.LayoutParams.FLAG_FULLSCREEN);
                }

                mScanDialog.setContentView(view);
                mScanDialog.setCancelable(false);

                mScanDialog.show();
                decoratedBarcodeView.resume();
            }
        });
    }


    private void stopScanner(CallbackContext callbackContext) {
        if (mScanDialog != null && mScanDialog.isShowing()) {
            mScanDialog.dismiss();
        }

        mScanDialog = null;

        if (callbackContext != null) {
            callbackContext.success("cancel");
        }
    }
}
