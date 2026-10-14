import 'dotenv/config';
import { type Document, MongoClient, type Filter } from 'mongodb';

export class MongoDb {
  private client: MongoClient | undefined;

  private uri(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('user:password@host')) {
      throw new Error('Set MONGODB_URI in .env');
    }
    return uri;
  }

  private databaseName(): string {
    const name = process.env.MONGODB_DB;
    if (!name || name === 'your-database') {
      throw new Error(
        'Set MONGODB_DB in .env to the database name (not the cluster host)'
      );
    }
    // Atlas hosts look like cluster0.xxxxx — those are not valid DB names
    if (name.includes('.')) {
      throw new Error(
        `MONGODB_DB="${name}" is invalid. Use the database name only (no '.'). Example: therapy`
      );
    }
    return name;
  }

  private async connect(): Promise<MongoClient> {
    if (this.client) return this.client;
    this.client = new MongoClient(this.uri());
    await this.client.connect();
    return this.client;
  }

  private async db() {
    await this.connect();
    return this.client!.db(this.databaseName());
  }

  async findOne<T extends Document = Document>(
    collectionName: string,
    filter: Filter<T> = {} as Filter<T>
  ) {
    const database = await this.db();
    return database.collection<T>(collectionName).findOne(filter);
  }

  async findAll<T extends Document = Document>(
    collectionName: string,
    filter: Filter<T> = {} as Filter<T>
  ) {
    const database = await this.db();
    return database.collection<T>(collectionName).find(filter).toArray();
  }

  async close(): Promise<void> {
    if (!this.client) return;
    await this.client.close();
    this.client = undefined;
  }
}

export const mongodb = new MongoDb();
