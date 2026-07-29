# Mais Soluções

Site institucional estático da Mais Soluções Engenharia.

## Desenvolvimento local

Não há etapa de compilação nem dependências para instalar. Sirva a pasta raiz com
um servidor HTTP local para que os caminhos e as páginas de projetos funcionem da
mesma forma que na hospedagem:

```powershell
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Estrutura

- `index.html`: página institucional.
- `css/styles.css` e `js/main.js`: estilos e interações da página inicial.
- `obras/<projeto>/index.html`: URL individual de cada obra.
- `css/project.css` e `js/project.js`: interface compartilhada das obras.
- `js/projects-data.js`: títulos, descrições, informações e galerias das obras.

Para atualizar o texto ou a galeria de uma obra, edite apenas o respectivo registro
em `js/projects-data.js`. Os nomes dos arquivos de imagem diferenciam maiúsculas de
minúsculas na hospedagem.

## Publicação

O projeto pode ser publicado diretamente em qualquer hospedagem de arquivos
estáticos, incluindo GitHub Pages. As fontes, os ícones e duas imagens da página
inicial são carregados de serviços externos.

