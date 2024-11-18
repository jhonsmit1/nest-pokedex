import { Injectable } from '@nestjs/common';
import { PokeResults } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { axiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  //dependencia de mi servicio

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, private readonly http: axiosAdapter,) { }


  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({});

  //   const { data } = await this.axios.get<PokeResults>('https://pokeapi.co/api/v2/pokemon?limit=10')

  //   const insertPromisesArray = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/')
  //     const no: number = +segments[segments.length - 2];

  //     // const pokemon = await this.pokemonModel.create({name,no})
  //     insertPromisesArray.push(this.pokemonModel.create({ name, no }))

  //   });
  //   await Promise.all(insertPromisesArray);
  //   return 'Seed executed';

  // };


  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResults>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert:{name:string,no:number}[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create({name,no})
      // insertPromisesArray.push(this.pokemonModel.create({ name, no }))
      pokemonToInsert.push({name,no})

    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';

  };






}
