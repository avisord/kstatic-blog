import fs from 'node:fs';
import { MongoClient } from 'mongodb';

const envText = fs.readFileSync('.env', 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const client = new MongoClient(process.env.DATABASE_URI);
await client.connect();
const db = client.db();
console.log('database:', db.databaseName);
const users = await db
  .collection('users')
  .find({}, { projection: { email: 1, createdAt: 1, updatedAt: 1, _id: 1 } })
  .toArray();
console.log('users count:', users.length);
for (const u of users) console.log('-', JSON.stringify(u));
await client.close();
