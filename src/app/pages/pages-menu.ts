import { NbMenuItem } from '@nebular/theme';
import { title } from 'process';
import { AuthResponse } from '../Models/authModel';

export class Sample{

  role:string = '';
  userData : any;

   getMenuItems(): NbMenuItem[] {


    const userData = sessionStorage.getItem('userDetails');
    if (userData == undefined || userData == null) {
      this.userData = null;
    } else {
      this.userData = JSON.parse(userData);
      this.role = this.userData.Role;
    }
  
  
    const MENU_ITEMS: NbMenuItem[] = [
      {
        title: 'Dashboard',
        link: 'onboarding/dashboard',
        icon: 'grid-outline',
        hidden: this.role == 'Vendor',
      },
      {
        title: 'Initiation form',
        link: 'onboarding/initiator-form',
        hidden: this.role == 'Admin',
        icon: 'file-text',
      },
      {
        title: 'Master',
        icon:'list-outline',
        hidden: this.role != 'Admin',
        children: [
          {
            title: 'Users',
            link: 'masters/users',
            icon: 'person-outline',
          },
          {
            title: 'Vendors',
            link: 'masters/vendors',
            icon: 'people-outline',
          }
        ]
      }
    ];
    return MENU_ITEMS;
  }
}