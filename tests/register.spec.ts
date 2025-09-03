import { test, expect } from '@playwright/test';

// Generamos un sufijo único para el nombre de usuario y el email para cada ejecución del test
const randomSuffix = new Date().getTime();
const testUsername = `testuser${randomSuffix}`;
const testEmail = `user${randomSuffix}@test.com`;
const testPassword = 'password123';

test.describe('User Registration', () => {

  test('should allow a new user to register', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('/#/register');

    // Rellenar el formulario
    await page.getByPlaceholder('Username').fill(testUsername);
    await page.getByPlaceholder('Email').fill(testEmail);
    await page.getByPlaceholder('Password').fill(testPassword);

    // Enviar el formulario
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Verificar que la URL cambió a la página de inicio (estamos logueados)
    await expect(page).toHaveURL(''); // La URL base es el home

    // Verificar que el nombre de usuario aparece en el navbar, confirmando el login
    await expect(page.locator(`.nav-link[href="/#/@${testUsername}"]`)).toBeVisible();
  });

  test('should not allow registration with an existing email', async ({ page }) => {
    // Primero, nos aseguramos de que el usuario de la prueba anterior exista.
    // Este test depende del éxito del anterior, lo cual no es ideal, pero sirve para la demo.
    // Una mejor aproximación sería crear el usuario vía API antes del test.

    // Navegar a la página de registro
    await page.goto('/#/register');

    // Intentar registrarse con el MISMO email
    await page.getByPlaceholder('Username').fill(`${testUsername}2`); // Usamos un nuevo username
    await page.getByPlaceholder('Email').fill(testEmail); // Pero el mismo email
    await page.getByPlaceholder('Password').fill(testPassword);

    // Enviar el formulario
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Verificar que aparece el mensaje de error
    const errorMessage = page.locator('.error-messages li');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('email has already been taken');
  });

});
