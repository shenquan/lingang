package com.magicalign.lingang;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

/**
 * Created by Administrator on 2016/4/14.
 */
public class StartActivity extends Activity{
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
//                Toast.makeText(StartActivity.this,"请最好在WIFI的情景下使用该服务",Toast.LENGTH_LONG).show();
                Intent intent = new Intent(StartActivity.this,MainActivity.class);
                startActivity(intent);
                StartActivity.this.finish();
            }
        },500);

    }
}
