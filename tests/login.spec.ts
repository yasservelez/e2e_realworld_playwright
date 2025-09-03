import { test, expect } from '@playwright/test';

// Generamos datos únicos para el usuario de este set de pruebas
const randomSuffix = new Date().getTime();
const testUsername = `loginuser${randomSuffix}`;
const testEmail = `login${randomSuffix}@test.com`;
const testPassword = 'password123';

test.describe('User Login and Logout', () => {

  // Antes de que todos los tests en este archivo se ejecuten, creamos un usuario vía API.
  // Esto hace que nuestros tests no dependan del test de registro y sean más rápidos y fiables.
  test.beforeAll(async ({ request }) => {
    const response = await request.post('https://conduit.productionready.io/api/users', {
      data: {
        user: {
          username: testUsername,
          email: testEmail,
          password: testPassword,
        },
      },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('should allow a registered user to log in and log out', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/#/login');

    // Rellenar el formulario con los datos del usuario que creamos
    await page.getByPlaceholder('Email').fill(testEmail);
    await page.getByPlaceholder('Password').fill(testPassword);

    // Click en "Sign in"
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verificar que estamos en la página de inicio y logueados
    await expect(page).toHaveURL('');
    await expect(page.locator(`.nav-link[href="/#/@${testUsername}"]`)).toBeVisible();

    // --- Proceso de Logout ---

    // Ir a la página de configuración
    await page.getByRole('link', { name: 'Settings' }).click();

    // Click en el botón de logout
    await page.getByRole('button', { name: 'Or click here to logout.' }).click();

    // Verificar que volvimos a la página de inicio
    await expect(page).toHaveURL('');

    // Verificar que el nombre de usuario ya no está y ahora vemos "Sign in"
    await expect(page.locator(`.nav-link[href="/#/@${testUsername}"]`)).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('should not allow login with incorrect password', async ({ page }) => {
    // Ir a la página de login
    await page.goto('/#/login');

    // Rellenar con contraseña incorrecta
    await page.getByPlaceholder('Email').fill(testEmail);
    await page.getByPlaceholder('Password').fill('wrongpassword');

    // Click en "Sign in"
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verificar que el mensaje de error aparece
    const errorMessage = page.locator('.error-messages li');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('is invalid');
  });
});
