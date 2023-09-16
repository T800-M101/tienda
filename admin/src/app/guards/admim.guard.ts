import { CanActivateFn, Router } from "@angular/router";
import { AdminService } from "../services/admin.service";
import { inject } from "@angular/core";


export const isAuthenticated: CanActivateFn = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  if(!adminService.isAuthenticated(['admin'])) {
    router.navigate(['login']);
    return false;
  }
  return true;
}
