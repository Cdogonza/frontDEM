// permission.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissionsMap: {[key: string]: string[]} = {

    'maolivera': ['ingresar_facturas', 'ver_facturas', 'editar_facturas', 'eliminar_facturas','mover_facturas'],
    'mpediferro': ['ingresar_facturas', 'ver_facturas', 'editar_facturas', 'eliminar_facturas','mover_facturas'],
    'gpaz': ['ingresar_facturas', 'ver_facturas', 'editar_facturas', 'eliminar_facturas','mover_facturas','tecnico'],
    'nimachado': ['tecnico'],
    'mamoreira': ['tecnico'],
    'dcarrera': ['tecnico'],
    'rucosta': ['tecnico'],
    'smesones': ['tecnico'],
    'test': ['administrativo'],
  };

  getUserPermissions(username: string): string[] {
    return this.permissionsMap[username] || ['ver_facturas']; 
  }

  hasPermission(username: string, permission: string): boolean {
    const permissions = this.getUserPermissions(username);
    return permissions.includes(permission);
  }
}