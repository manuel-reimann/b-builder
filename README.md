Bouquet Builder – Web App for Photorealistic Bouquet Designs

Project: Bachelor Thesis Web Development (SAE Zurich 2025)  
Author: Manuel Reimann  
Company: agrotropic AG  
Technologies: React, TypeScript, Vite, Tailwind, Konva, DnD Kit, Flux.1 Context, Supabase

---

✨ Overview

Bouquet Builder is a web application that allows employees and B2B customers of agrotropic AG to digitally design flower bouquets. Using drag-and-drop elements, users create a floral composition in a 2D editor, which can then be rendered into a photorealistic image via integration with a generative AI.

**Why?**

The current quotation process (physical arrangement, photography, retouching) is time-consuming, expensive, and difficult to reproduce. This project aims to significantly optimize the process using digital tools.

---

⚖️ Features

**Editor Functions**

- Drag & drop flowers (assets) onto a canvas
- Floristic categories via accordion
- Non-draggable sleeve element (paper wrap) always in the background (cannot be deleted)
- Right sidebar with real-time layer panel (reordering via drag-and-drop)
- Reversible z-index system: newest elements on top, sleeve always at the bottom
- Live preview of flowers via hover
- Duplicate elements quickly
- Safe canvas click to deselect current selection
- Sleeve element is protected from deletion
- Draft management: create, rename, and delete working drafts
- Drag-and-drop support from sidebar (DnD Kit)
- Real-time updates in the layer panel

**Generative AI**

- Integration with Flux.1 Context via reference images (not text prompts)
- Score-based evaluation system for reproducibility of generated images

---

⚙️ Tech Stack

| Area        | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | React + TypeScript                                  |
| Build Tool  | Vite                                                |
| Styling     | Tailwind CSS                                        |
| Canvas      | Konva                                               |
| Drag & Drop | @dnd-kit                                            |
| Backend     | Supabase (RLS enabled for all user-specific tables) |
| Image AI    | Flux.1 Context                                      |
| State       | React useState                                      |

---

🔐 Environment Variables

- A `.env` file is **required** to run the project locally. **Do not commit** your `.env` file.
- A `.env.example` file is provided as a template for the required variables.

---
