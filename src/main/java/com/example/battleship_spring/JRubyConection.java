package com.example.battleship_spring;

//import org.jruby.embed.InvokeFailedException;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Map;

public class JRubyConection {

    private ScriptEngineManager manager;
    private ScriptEngine engine;
    private FileReader f;
    private Object obj;

    public JRubyConection(String filePath) {
        try {
            // Scriptエンジンを生成
            this.manager = new ScriptEngineManager();
            this.engine = manager.getEngineByName("jruby");
            // RubyスクリプトのFileReaderを準備
            f = new FileReader(filePath);
            // Rubyスクリプトを評価
            this.obj = engine.eval(f);
        }catch (FileNotFoundException e){
            e.printStackTrace();
        }catch (ScriptException e){
            e.printStackTrace();
        }
    }

    public String call_funsiton(String func, String arg){
        String value = "";
        try{
            // 関数呼び出し
            Object obj = ((Invocable) engine).invokeFunction(func, arg);
            value = obj.toString();
            //System.out.println("in call function: "+value);
        } catch (ScriptException e){
            e.printStackTrace();
        }catch (NoSuchMethodException e){
            e.printStackTrace();
        }catch (NullPointerException e){
            value = "nil";
        }
        return value;
    }

    public String call_method(String method_, String args){

        String value = "";

        try{
            // メソッド呼び出し
            Object obj = ((Invocable) engine).invokeMethod(this.obj, method_, args);
            value = obj.toString();
        } catch (ScriptException e){
            e.printStackTrace();
        }catch (NoSuchMethodException e){
            e.printStackTrace();
        }catch (NullPointerException e){
            value = "nil";
        }/*catch (InvokeFailedException e){
            e.printStackTrace();
            return "exception";
        }*/
        return value;
    }

    public String call_method(String method_, Map args){

        String value = "";

        try{
            // メソッド呼び出し
            Object obj = ((Invocable) engine).invokeMethod(this.obj, method_, args);
            value = obj.toString();
        } catch (ScriptException e){
            e.printStackTrace();
        }catch (NoSuchMethodException e){
            e.printStackTrace();
        }catch (NullPointerException e){
            value = "nil";
        }/*catch (InvokeFailedException e){
            e.printStackTrace();
            return "exception";
        }*/
        return value;
    }

    public String call_method(String method_){

        String value = "";

        try{
            // メソッド呼び出し
            Object obj = ((Invocable) engine).invokeMethod(this.obj, method_);
            value = obj.toString();
        } catch (ScriptException e){
            e.printStackTrace();
        }catch (NoSuchMethodException e){
            e.printStackTrace();
        }catch (NullPointerException e){
            value = "nil";
        }/*catch (InvokeFailedException e){
            e.printStackTrace();
            return "exception";
        }*/
        return value;
    }
}
