import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FullUserProfile } from '../../models/user';
import { UserService } from '../../services/user';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [LoadingSpinner, FormsModule, RouterLink, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);

  users = signal<FullUserProfile[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));
  sortProperty = signal('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  actionLoadingMap = signal<Map<number, boolean>>(new Map());

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((query) => {
      this.searchQuery.set(query);
      this.currentPage.set(0);
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);

    this.userService
      .getPaginatedUsers(
        this.searchQuery(),
        this.currentPage(),
        this.pageSize(),
        this.sortProperty(),
        this.sortDirection()
      )
      .subscribe({
        next: (response) => {
          this.users.set(response.content as FullUserProfile[]);
          this.totalElements.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastService.error(
            'Failed to load users: ' + this.errorService.getErrorMessage(err)
          );
          this.isLoading.set(false);
        },
      });
  }

  onSearchQueryChange(query: string): void {
    this.searchSubject.next(query);
  }

  onSort(property: string): void {
    const finalProperty = property === 'email' ? 'credential.email' : property;

    if (this.sortProperty() === finalProperty) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortProperty.set(finalProperty);
      this.sortDirection.set('desc');
    }
    this.currentPage.set(0);
    this.loadUsers();
  }

  getSortIcon(property: string): string {
    const isCurrentSort = this.sortProperty() === property;

    if (property === 'email' && this.sortProperty() === 'credential.email') {
      return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
    }

    if (!isCurrentSort) return 'swap_vert';
    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  pagesArray = computed(() => {
    const totalPages = this.totalPages();
    if (totalPages === 0) return [];

    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage() - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  });

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.loadUsers();
    }
  }

  isActionLoading(userId: number): boolean {
    return this.actionLoadingMap().get(userId) || false;
  }

  onBanUser(userId: number): void {
    this.setActionLoading(userId, true);
    this.userService.banUser(userId).subscribe({
      next: () => {
        this.toastService.success(`User ${userId} successfully banned.`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(this.errorService.getErrorMessage(err));
        this.setActionLoading(userId, false);
      },
    });
  }

  onUnbanUser(userId: number): void {
    this.setActionLoading(userId, true);
    this.userService.unbanUser(userId).subscribe({
      next: () => {
        this.toastService.success(`User ${userId} successfully unbanned.`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(this.errorService.getErrorMessage(err));
        this.setActionLoading(userId, false);
      },
    });
  }

  private setActionLoading(userId: number, loading: boolean): void {
    this.actionLoadingMap.update((map) => {
      const newMap = new Map(map);
      if (loading) {
        newMap.set(userId, true);
      } else {
        newMap.delete(userId);
      }
      return newMap;
    });
  }
}
