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

  static async fetchAll() {
    const response = await fetch(`${ENDPOINT}/personnages`);
    const data = await response.json();
    return data.map(item => new Personnage(
      parseInt(item.id, 10),
      item.nom,
      item.role,
      item.equipements,
      item.description,
      item.image,
      item.note,
      item.points || 0,
      item.combats || 0
    ));
  }

  static async fetchById(id) {
    const response = await fetch(`${ENDPOINT}/personnages/${id}`);
    const data = await response.json();
    return new Personnage(data.id, data.nom, data.role, data.equipements, data.description, data.image, data.note, data.points || 0, data.combats || 0);
  }

  static async updateNote(id, note) {
    await fetch(`${ENDPOINT}/personnages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
  }
}