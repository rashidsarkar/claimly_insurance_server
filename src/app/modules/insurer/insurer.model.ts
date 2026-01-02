import { model, Schema } from 'mongoose';
import { IInsurer } from './insurer.interface';

const insurerSchema = new Schema<IInsurer>({}, { timestamps: true });

const Insurer = model<IInsurer>('Insurer', insurerSchema);
export default Insurer;
