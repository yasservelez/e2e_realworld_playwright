import { test, expect } from '@playwright/test';

// Generamos datos únicos para el usuario y el artículo
const randomSuffix = new Date().getTime();
const testUsername = `articleuser${randomSuffix}`;
const testEmail = `article${randomSuffix}@test.com`;
const testPassword = 'password123';

const articleTitle = `My Test Article ${randomSuffix}`;
const articleAbout = 'About Playwright';
const articleBody = 'This is a test article created by an automated Playwright script.';

test.describe('Article Creation', () => {

  // Antes de todo, creamos un usuario vía API para tener credenciales válidas.
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

  test('should allow a logged-in user to create an article', async ({ page }) => {
    // Paso 1: Iniciar sesión desde la UI
    await page.goto('/#/login');
    await page.getByPlaceholder('Email').fill(testEmail);
    await page.getByPlaceholder('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.locator(`.nav-link[href="/#/@${testUsername}"]`)).toBeVisible();

    // Paso 2: Navegar a la página de nuevo artículo
    await page.getByRole('link', { name: 'New Article' }).click();
    await expect(page).toHaveURL('/#/editor');

    // Paso 3: Rellenar y enviar el formulario del artículo
    await page.getByPlaceholder('Article Title').fill(articleTitle);
    await page.getByPlaceholder("What's this article about?").fill(articleAbout);
    await page.getByPlaceholder('Write your article (in markdown)').fill(articleBody);
    await page.getByRole('button', { name: 'Publish Article' }).click();

    // Paso 4: Verificar que el artículo fue creado correctamente
    
    // La URL debería ser la del nuevo artículo (basada en el título "slugificado")
    await expect(page).toHaveURL(/.*\/article\/my-test-article-.*/);

    // El título y el cuerpo del artículo deben estar visibles
    await expect(page.locator('h1')).toHaveText(articleTitle);
    await expect(page.locator('.article-content p')).toHaveText(articleBody);
    // El nombre del autor debe ser visible
    await expect(page.getByText(testUsername).first()).toBeVisible();
  });
});
