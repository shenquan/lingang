package com.magicalign.lingang;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.provider.Settings;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {

    public Toast mToast;
    private WebView mWebView;
    private Context mContext;
    private long mFirstTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
//        getActionBar().hide();
        mContext = getApplicationContext();
        //下面3行代码，显示请求权限
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        String provider = LocationManager.GPS_PROVIDER;
        Location location = locationManager.getLastKnownLocation(provider);

        //检测GPS
        isGpsOpen();
        //检测网络
        isNetworkConnected();

        mWebView = (WebView) findViewById(R.id.webview);
        mWebView.loadUrl("file:///android_asset/1_0ShouYe.html");
//        mWebView.loadUrl("file:///android_asset/jsonrpcdemo.html");
        //允许js
        mWebView.getSettings().setJavaScriptEnabled(true);
        //点击页面设置重写
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

    }//onCreate()

    //重写按下返回键的效果
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

/*
//只显示一次启动页（App没被kill的情况下）
    @Override
    public void onBackPressed() {


        // super.onBackPressed(); 	不要调用父类的方法
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addCategory(Intent.CATEGORY_HOME);
        startActivity(intent);


    }
*/

    /**
     * 设置连续2次点击退出程序
     *
     * @param keyCode
     * @param event
     * @return
     */
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            long secondTime = System.currentTimeMillis();
            //如果间隔大于750ms则不退出
            if (secondTime - mFirstTime > 750) {
                mFirstTime = secondTime;
                showToast("再按一次退出应用", 1000);
                return true;//必须返回
            } else {
                finish();//加上这个先结束当前activity  退出时会比较流畅
                System.exit(0);
            }
        }
        return super.onKeyUp(keyCode, event);
    }

    /**
     * 判断GPS是否开启
     *
     * @return 返回GPS状态
     */
    private void isGpsOpen() {
        LocationManager locationManager = (LocationManager) mContext.
                getSystemService(Context.LOCATION_SERVICE);
        boolean isOpen = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        //若没打开，显示对话框
        if (!isOpen) {
            setGps();
        }
    }//isGpsOpen

    /**
     * 设置GPS
     */
    private void setGps() {
        //下面这句的环境变量只能用MainActivity.this
        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
        builder.setTitle("GPS设置").setMessage("当前没有打开GPS，是否打开GPS以提供更精确的" +
                "服务").setPositiveButton("设置", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try {
                    //进入GPS设置页面
                    //Toast.makeText(this,"使用",Toast.LENGTH_LONG).show();
                    startActivity(intent);

                } catch (ActivityNotFoundException e) {
                    // The Android SDK doc says that the location settings activity
                    // may not be found. In that case show the general settings.
                    //Toast.makeText(this,"使用",Toast.LENGTH_LONG).show();
                    intent.setAction(Settings.ACTION_SETTINGS);
                    startActivity(intent);
                }
            }
        }).setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
            }
        }).show();
    }

    /**
     * 检测网络
     */
    private void isNetworkConnected() {
        ConnectivityManager connectivity = (ConnectivityManager) mContext
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo ni = connectivity.getActiveNetworkInfo();
        if (!(ni != null && ni.isConnectedOrConnecting())) {
            // 当前网络是未连接的
            showToast("当前网络未连接", Toast.LENGTH_LONG);
        }

    }

    /**
     * 只显示一次Toast
     *
     * @param msg      显示信息
     * @param showTime 显示时间
     */
    public void showToast(String msg, int showTime) {
        if (mToast == null) {
            mToast = Toast.makeText(mContext, msg, showTime);
        } else {
            mToast.setText(msg);
        }

        mToast.show();

    }

}
