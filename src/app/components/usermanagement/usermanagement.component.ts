import { Component,OnInit } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgClass,NgFor,NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-usermanagement',
  imports: [NgFor,NgIf,CommonModule,ReactiveFormsModule,NavBarComponent],
  standalone: true,
  providers: [AuthService],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})
export class UsermanagementComponent implements OnInit{

ngOnInit(): void {
  this.loadUsers();
}
constructor(
  private fb: FormBuilder,
  private userService: AuthService
) {
  this.userForm = this.fb.group({
    id: [null],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}
users: User[] = [];
userForm: FormGroup;
showModal = false;
isEditing = false;
 currentUserId: number | null = null;

loadUsers(): void {
  this.userService.getUsers().subscribe(
    (data) => {
      this.users = data;
    },
    (error) => {
      console.error('Error al cargar usuarios:', error);
      // Aquí podrías mostrar un mensaje de error
    }
  );

}
 openUserModal(): void {
    this.isEditing = false;
    // this.currentUserId = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  editUser(user: User): void {
    this.isEditing = true;
    // this.currentUserId = user.id;
    this.userForm.patchValue({
      username: user.username,
      email: user.email
    });
    // Quitar validadores de password en modo edición
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;
    
    if (this.isEditing && this.currentUserId) {
      // Si estamos editando, actualizamos el usuario
      this.userService.updateUser(this.currentUserId, userData).subscribe(
        () => {
          this.loadUsers();
          this.closeModal();
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          // Aquí podrías mostrar un mensaje de error
        }
      );
    } else {
      // Si estamos creando, agregamos un nuevo usuario
      this.userService.createUser(userData).subscribe(
            () => {
              console.log('Usuario creado exitosamente'+ userData.username);
          this.loadUsers();
          this.closeModal();
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          // Aquí podrías mostrar un mensaje de error
        }
      );
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.loadUsers();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
          // Aquí podrías mostrar un mensaje de error
        }
      );
    }
  }

}
