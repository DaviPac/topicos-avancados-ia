# code/ocr-android

> Medição do OCR (Tesseract) no celular, para o porquê do Tesseract no § 1 do `va2/tec.md`.
> Não é o app do Vero: é só uma tela que lê um print e cronometra.

- `app/src/main/java/br/ufrpe/vero/ocr/MainActivity.java`: a tela inteira (escolher print, OCR, tempos).
- `app/src/main/assets/tessdata/por.traineddata`: modelo de português.
- `app/build.gradle`: dependência do Tesseract4Android 4.9.0 (JitPack).
- `medicoes.md`: os tempos medidos no celular (registro do § 1 do `va2/tec.md`).
