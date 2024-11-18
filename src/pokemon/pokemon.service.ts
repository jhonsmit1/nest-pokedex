import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { paginatioDTO } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, private readonly configService: ConfigService) {

    //!GENERAR UN ERRO SI NO LO ENCUENTRA
    // console.log(configService.getOrThrow('jwt-seed'))
    // const port = configService.get<number>('port')
    // console.log("🚀 ~ PokemonService ~ port:", port)
    // console.log(process.env.PORT);
    this.defaultLimit = configService.get<number>('defaultLimit');

  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll(paginatioDTO: paginatioDTO) {
    const { limit = 10, offset = 0 } = paginatioDTO


    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v')
  }

  async findOne(id: string) {
    console.log("🚀 ~ PokemonService ~ findOne ~ id:", id);

    let pokemon: Pokemon;

    // Buscar por número
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    // Buscar por MongoID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Buscar por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.toLowerCase().trim() });
    }

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    return pokemon;
  }


  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    }
    try {
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...UpdatePokemonDto };
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne();
    // const result = await  this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount == 0) throw new BadRequestException(`Pokemon con id "${id}" not found`);
    return { message: `Pokemon has been deleted` };

  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(JSON.stringify(error))
    }
    console.log(error);
    throw new InternalServerErrorException('Cant create pokemon - check server logs');
  }
}
