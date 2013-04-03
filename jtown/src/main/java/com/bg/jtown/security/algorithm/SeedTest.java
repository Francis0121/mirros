package com.bg.jtown.security.algorithm;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

/**
 * 
 * 
 * @author 손님138
 * @version 1.0, 2008. 03. 11
 */
/*
 * History
 * -2008. 03. 11, Create, 손님138, [Description] 
 */

public class SeedTest {

	public static void main(String[] args) throws Exception {
		String text = "Seed 암호화 Test \t 잘되겠지. HaHa~~";
		String key = "junducki_goormaa";
		StringBuilder trace = new StringBuilder();
		
		trace.append("Plain Text :: [").append(text).append("]");
		System.out.println(trace.toString());
		
		SeedCipher seed = new SeedCipher();
		String encryptText = Base64.encode(seed.encrypt(text, key.getBytes(), "UTF-8"));
		trace = new StringBuilder();
		trace.append("Encrypt Text (Base64 Encoding) :: [").append(encryptText).append("]");
		System.out.println(trace.toString());
		
		System.out.println(encryptText);
		byte[] encryptbytes = Base64.decode(encryptText);
		String decryptText = seed.decryptAsString(encryptbytes, key.getBytes(), "UTF-8");
		
		trace = new StringBuilder();
		trace.append("Decrypt Text :: [").append(decryptText).append("]");
		System.out.println(trace.toString());
	}
}
