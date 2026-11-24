package br.ufrpe.vero.ocr;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.googlecode.tesseract.android.TessBaseAPI;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Escolhe um print da galeria, roda o Tesseract (português) nele e mostra
 * o texto lido e quanto tempo levou. Serve só para medir o OCR no celular.
 */
public class MainActivity extends Activity {

    private static final int ESCOLHER_IMAGEM = 1;
    private static final String IDIOMA = "por";

    private TextView saida;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Button escolher = new Button(this);
        escolher.setText("escolher print");
        escolher.setOnClickListener(v -> {
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.setType("image/*");
            startActivityForResult(i, ESCOLHER_IMAGEM);
        });

        saida = new TextView(this);
        saida.setTextIsSelectable(true);
        saida.setText(aparelho());

        LinearLayout tela = new LinearLayout(this);
        tela.setOrientation(LinearLayout.VERTICAL);
        tela.setPadding(32, 32, 32, 32);
        tela.addView(escolher);
        tela.addView(saida);

        ScrollView rolagem = new ScrollView(this);
        rolagem.addView(tela);
        setContentView(rolagem);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != ESCOLHER_IMAGEM || resultCode != RESULT_OK || data == null) return;
        Uri imagem = data.getData();
        saida.setText(aparelho() + "\nlendo...");
        new Thread(() -> {
            String resultado = lerImagem(imagem);
            runOnUiThread(() -> saida.setText(resultado));
        }).start();
    }

    private String aparelho() {
        return "aparelho: " + Build.MANUFACTURER + " " + Build.MODEL
                + " · Android " + Build.VERSION.RELEASE + "\n";
    }

    private String lerImagem(Uri imagem) {
        TessBaseAPI tess = new TessBaseAPI();
        try {
            Bitmap bitmap;
            try (InputStream in = getContentResolver().openInputStream(imagem)) {
                bitmap = BitmapFactory.decodeStream(in);
            }

            long t0 = SystemClock.elapsedRealtime();
            if (!tess.init(prepararDados(), IDIOMA)) return "erro: não iniciou o Tesseract";
            long t1 = SystemClock.elapsedRealtime();
            tess.setImage(bitmap);
            String texto = tess.getUTF8Text();
            long t2 = SystemClock.elapsedRealtime();

            return aparelho()
                    + "tesseract: " + tess.getVersion() + " · idioma: " + IDIOMA + "\n"
                    + "imagem: " + bitmap.getWidth() + " x " + bitmap.getHeight() + " px\n"
                    + "carregar o modelo: " + (t1 - t0) + " ms\n"
                    + "ler o print: " + (t2 - t1) + " ms\n\n"
                    + "texto lido:\n" + texto;
        } catch (Exception e) {
            return "erro: " + e;
        } finally {
            tess.recycle();
        }
    }

    /** Copia o por.traineddata dos assets para uma pasta que o Tesseract consegue ler. */
    private String prepararDados() throws Exception {
        File pasta = new File(getFilesDir(), "tesseract");
        File arquivo = new File(pasta, "tessdata/" + IDIOMA + ".traineddata");
        if (!arquivo.exists()) {
            arquivo.getParentFile().mkdirs();
            try (InputStream in = getAssets().open("tessdata/" + IDIOMA + ".traineddata");
                 OutputStream out = new FileOutputStream(arquivo)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
        }
        return pasta.getAbsolutePath();
    }
}
