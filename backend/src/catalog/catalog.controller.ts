import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';

@Controller('catalog')
export class CatalogController {
  constructor(private catalog: CatalogService) {}

  // GET /catalog/groups  → llena el primer dropdown
  @Get('groups')
  groups() {
    return this.catalog.findGroups();
  }

  // GET /catalog/groups/3/muscles  → llena el segundo dropdown
  @Get('groups/:id/muscles')
  muscles(@Param('id', ParseIntPipe) id: number) {
    return this.catalog.findMuscles(id);
  }
}