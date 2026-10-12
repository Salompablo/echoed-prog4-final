import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created with no toasts', () => {
    expect(service).toBeTruthy();
    expect(service.toasts()).toEqual([]);
  });

  it('show should add toasts with an incrementing id', () => {
    service.show('info', 'first');
    service.show('error', 'second');

    const toasts = service.toasts();
    expect(toasts.length).toBe(2);
    expect(toasts[0]).toEqual({ id: 0, type: 'info', message: 'first', duration: undefined });
    expect(toasts[1].id).toBe(1);
    expect(toasts[1].type).toBe('error');
  });

  it('show without duration should keep the toast until it is removed manually', fakeAsync(() => {
    service.show('info', 'sticky');

    tick(60000);

    expect(service.toasts().length).toBe(1);
  }));

  it('show with duration should remove the toast after that time', fakeAsync(() => {
    service.show('info', 'temp', 1000);

    tick(999);
    expect(service.toasts().length).toBe(1);

    tick(1);
    expect(service.toasts().length).toBe(0);
  }));

  it('remove should delete only the toast with the given id', () => {
    service.show('info', 'a');
    service.show('info', 'b');

    service.remove(0);

    expect(service.toasts().map((t) => t.message)).toEqual(['b']);
  });

  it('convenience methods should set the type and their default durations', fakeAsync(() => {
    service.success('s');
    service.error('e');
    service.info('i');
    service.warning('w');

    expect(service.toasts().map((t) => [t.type, t.duration])).toEqual([
      ['success', 3000],
      ['error', 5000],
      ['info', 3000],
      ['warning', 4000],
    ]);

    tick(5000);
    expect(service.toasts()).toEqual([]);
  }));

  it('convenience methods should accept a custom duration', fakeAsync(() => {
    service.success('s', 500);

    tick(500);

    expect(service.toasts().length).toBe(0);
  }));
});
