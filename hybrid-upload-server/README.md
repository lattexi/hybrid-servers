# Upload serveri Hybridisovellukset kurssille

- TypeScript tyypit on ladattu npm:llä https://github.com/ilkkamtk/hybrid-types reposta.

- `http://localhost:3002/` enpointissa on Apidoc

- `http://localhost:3002/api/v1/` on Apiroot

### Thumbnailien teosta

- `src/middlewares.ts` tiedostossa on `makeThumbnail()` middleware funktio. Kommenteissa esimerkki miten tiedostopolku korjataan omaan käyttöjärjestelmään sopivaksi jos sellainen on tarpeen.

- Jos uploudaat videoita, vaatii ffmpegin toimiakseen. Ks. `src/utils/getVideoThumbnail.ts`

#### Asenna ffmpeg:

- Linux: https://www.ffmpeg.org/download.html#build-linux
- Windows: https://www.ffmpeg.org/download.html#build-windows
- Mac: `brew install ffmpeg`
