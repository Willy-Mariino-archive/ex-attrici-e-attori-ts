/*

📌 Milestone 1
Crea un type alias Person per rappresentare una persona generica.

Il tipo deve includere le seguenti proprietà:

id: numero identificativo, non modificabile
name: nome completo, stringa non modificabile
birth_year: anno di nascita, numero
death_year: anno di morte, numero opzionale
biography: breve biografia, stringa
image: URL dell'immagine, stringa

📌 Milestone 2
Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

most_famous_movies: una tuple di 3 stringhe
awards: una stringa
nationality: una stringa tra un insieme definito di valori.
Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

📌 Milestone 3
Crea una funzione getActress che, dato un id, effettua una chiamata a:

GET /actresses/:id
La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.


📌 Milestone 4
Crea una funzione getAllActresses che chiama:

GET /actresses
La funzione deve restituire un array di oggetti Actress.

Può essere anche un array vuoto.


📌 Milestone 5
Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

*/

type Person = {

  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string
  image: string

}

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ("American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese")

}

// type narrowing per assicurarsi che la struttura dei dati sia corretta, altrimenti i json ricevuti tramite fetch sono di tipo "any" di default.
function isActress(datiAttrici: unknown): datiAttrici is Actress {

  if (
    datiAttrici &&
    typeof datiAttrici === "object" &&

    "id" in datiAttrici &&
    typeof datiAttrici.id === "number" &&

    "name" in datiAttrici &&
    typeof datiAttrici.name === "string" &&

    "birth_year" in datiAttrici &&
    typeof datiAttrici.birth_year === "number" &&

    "death_year" in datiAttrici &&
    typeof datiAttrici.death_year === "number" &&

    "biography" in datiAttrici &&
    typeof datiAttrici.biography &&


    "image" in datiAttrici &&
    typeof datiAttrici.image
  ) {
    return true
  }
  else {
    return false
  }
}

async function getActress(id: number): Promise<Actress | null> {
  try {

    const response = await fetch(`http://localhost:3333/actresses/${id}`) // la type inference si occupa già di determinare che la fetch restituisce un oggetto di tipo response, quindi non devo scrivere const response: response = await fetch

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }

    const datiAttrici = await response.json()

    if (!isActress(datiAttrici)) {
      throw new Error("formato dati non valido")
    }

    return datiAttrici



  }

  catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero dati", error) // In TypeScript, il parametro error in un catch è di tipo unknown di default. quindi anche qui occorre untype narrowing
      return null
    }

    return null
  }

  finally {
    console.log("operazione completata")
  }
}

(async () => {
  const attrice = await getActress(1)
  console.log("dati attrice", attrice)
})()