## Docker harjoitus

Olin aiemmalla kurssilla tehnyt hybrid palvelimista monorepo tyylisen oman repositorion, jota muokkasin ja joka oli helppo ajaa. Tein siihen docker harjoituksen. Harjoitusta varten loin jokaiselle palvelimelle oman Dockerfilen jossa oli build, dev ja prod.

Käytin yhteistä docker compose tiedostoa, jossa määrittelin profiilit dev ja prod. Dev profiilissa palvelimet ajetaan npm run dev komennolla ja watch toimii. Prod profiilissa ajetaan build jonka jälkeen koodi ja node_modules kopioidaan erilliseen imageen, joka ajetaan node index.js komennolla.

docker compose watch (ajaa kehitysympäristön jossa hot reload)
docker compose --profile prod up (ajaa tuotantoympäristön jossa minimaalinen image)

Totesin kokeilemalla, että expressissä vakiona palvelin pyörii osoitteessa 0.0.0.0 joten en joutunut muokkaamaan koodia ollenkaan, vaikka tehtävänannossa niin kehotettiin. Palvelimet keskustelevat dockerin sisäisessä verkossa osoitteilla kuten http://media:3000 ja ulospäin ne näkyvät docker composessa määritellyillä porteilla kuten localhost:3000.

Tein myös volyymin jossa on tietokanta ja tietokannan alustus skripti, joka ajetaan vain ensimmäisellä kerralla kun kontti luodaan. Käytin myös healthcheck ominaisuutta, joka tarkistaa että tietokanta on käynnissä ennen kuin muut palvelimet yrittävät yhdistää siihen.

Käytin .env.docker tiedostoja (jotka on gitissä helppouden vuoksi) jotta docker compose tiedostossa ei ole ympäristömuuttujia kovakoodattuna.

Julkaisin sovelluksen kotipalvelimelleni, joka toimii cloudflaren kanssa. Testasin myös, että docker toimii täysin automaattisesti, eli kun sammutan ja käynnistän palvelimen uudestaan, niin palvelimet pyörivät automaattisesti uudestaan.
