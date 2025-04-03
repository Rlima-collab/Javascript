import { ENDPOINT } from './config.js';

export class Personnage {
  constructor(id, nom, role, equipements, description, image, note, points = 0, combats = 0) {
    this.id = id;
    this.nom = nom;
    this.role = role;
    this.equipements = equipements;
    this.description = description;
    this.image = image;
    this.note = note;
    this.points = points;
    this.combats = combats; 
  }

  // Méthode statique pour récupérer tous les personnages depuis l'API
  static async fetchAll() {
    const response = await fetch(`${ENDPOINT}/personnages`); // Requête GET vers l'API
    const data = await response.json(); // Conversion de la réponse en JSON
    return data.map(item => new Personnage(
      parseInt(item.id, 10), // Conversion de l'ID en entier
      item.nom,
      item.role,
      item.equipements,
      item.description,
      item.image,
      item.note,
      item.points || 0, // Valeur par défaut : 0 si non défini
      item.combats || 0 // Valeur par défaut : 0 si non défini
    ));
  }

  // Méthode statique pour récupérer un personnage par son ID
  static async fetchById(id) {
    const response = await fetch(`${ENDPOINT}/personnages/${id}`); // Requête GET pour un personnage spécifique
    const data = await response.json(); // Conversion de la réponse en JSON
    return new Personnage(
      data.id,
      data.nom,
      data.role,
      data.equipements,
      data.description,
      data.image,
      data.note,
      data.points || 0, // Valeur par défaut : 0 si non défini
      data.combats || 0 // Valeur par défaut : 0 si non défini
    );
  }

  // Méthode statique pour mettre à jour la note d'un personnage
  static async updateNote(id, note) {
    await fetch(`${ENDPOINT}/personnages/${id}`, {
      method: 'PATCH', // Utilisation de la méthode PATCH pour mettre à jour partiellement les données
      headers: { 'Content-Type': 'application/json' }, // En-tête pour indiquer le type de contenu
      body: JSON.stringify({ note }) // Corps de la requête contenant la nouvelle note
    });
  }
}