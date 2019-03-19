package org.sunbird.openrap.asynctask;

import android.os.AsyncTask;

import org.json.JSONObject;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;


public class ConnectToOpenrapAsyncTask extends AsyncTask<JSONObject, Void, Boolean> {

    private InetAddress mHostAddress;
    private int mHostPort;
    private OnConnectionCompleted mOnConnectionCompleted;

    public ConnectToOpenrapAsyncTask(InetAddress hostAddress, int hostPort, OnConnectionCompleted onConnectionCompleted) {
        this.mHostAddress = hostAddress;
        this.mHostPort = hostPort;
        this.mOnConnectionCompleted = onConnectionCompleted;
    }

    @Override
    protected Boolean doInBackground(JSONObject... jsonObjects) {

        Socket socket = null;
        DataInputStream dataInputStream = null;
        DataOutputStream dataOutputStream = null;
        boolean isConnected;

        try {

            socket = new Socket(mHostAddress, mHostPort);
            dataInputStream = new DataInputStream(socket.getInputStream());
            dataOutputStream = new DataOutputStream(socket.getOutputStream());
            isConnected = true;
        } catch (IOException e) {
            e.printStackTrace();
            isConnected = false;
        } finally {

            if (socket != null) {
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (dataInputStream != null) {
                try {
                    dataInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            if (dataOutputStream != null) {
                try {
                    dataOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return isConnected;
    }

    @Override
    protected void onPostExecute(Boolean aBoolean) {
        if (mOnConnectionCompleted != null) {
            mOnConnectionCompleted.onConnectionCompleted(aBoolean);
        }
    }

    public interface OnConnectionCompleted {
        void onConnectionCompleted(boolean isConnectionDone);
    }
}
