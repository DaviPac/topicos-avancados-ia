# ocr-android

App mínimo para medir o Tesseract no celular (peça de apoio do Vero, § 1 do `va2/tec.md`).
Escolhe um print da galeria, roda o OCR em português e mostra o aparelho, a versão do
Tesseract, o tamanho da imagem, o tempo para carregar o modelo, o tempo para ler o print
e o texto lido.

- OCR: [Tesseract4Android](https://github.com/adaptech-cz/Tesseract4Android) 4.9.0 (Apache-2.0),
  que empacota o Tesseract para Android.
- modelo: `app/src/main/assets/tessdata/por.traineddata`, o mesmo do Tesseract do PC
  (`/usr/share/tesseract-ocr/4.00/tessdata/`).

## compilar

Precisa do JDK 17 e do Android SDK (plataforma 35, build-tools 35.0.1).

```bash
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./gradlew assembleDebug
```

O APK sai em `app/build/outputs/apk/debug/app-debug.apk`.

## instalar

Copie o APK para o celular e abra (permita "instalar apps desconhecidos"), ou, com depuração USB:

```bash
~/Android/Sdk/platform-tools/adb install app/build/outputs/apk/debug/app-debug.apk
```
