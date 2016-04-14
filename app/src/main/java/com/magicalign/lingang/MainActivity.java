package com.magicalign.lingang;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getActionBar().hide();

        webView = (WebView) findViewById(R.id.webview);
        webView.loadUrl("file:///android_asset/1_0ShouYe.html");
        //允许js
        webView.getSettings().setJavaScriptEnabled(true);
        //点击页面设置重写
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return super.shouldOverrideUrlLoading(view, url);
            }
        });


    }

    //重写按下返回键的效果


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (webView.canGoBack() && keyCode == KeyEvent.KEYCODE_BACK) {
            webView.goBack();
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }
}
