/* Dark Mode CSS Additions
 * These are the additional CSS styles needed for dark mode support
 * Add these to frontend/styles/globals.css
 */

/* Dark Mode Base Styles */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

/* Dark Mode Utilities - Add to your globals.css */
html.dark {
  color-scheme: dark;
}

html.dark body {
  @apply bg-gray-950 text-gray-100;
}

/* Shadows in Dark Mode */
html.dark .shadow-base {
  @apply shadow-lg;
}

html.dark .hover:shadow-lg {
  @apply hover:shadow-2xl;
}

/* Cards in Dark Mode */
html.dark .bg-white {
  @apply bg-gray-900;
}

html.dark .bg-gray-50 {
  @apply bg-gray-800;
}

html.dark .bg-gray-100 {
  @apply bg-gray-700;
}

html.dark .text-gray-900 {
  @apply text-gray-100;
}

html.dark .text-gray-600 {
  @apply text-gray-400;
}

html.dark .text-gray-700 {
  @apply text-gray-300;
}

html.dark .border-gray-200 {
  @apply border-gray-700;
}

html.dark .border-gray-300 {
  @apply border-gray-600;
}

/* Form Inputs in Dark Mode */
html.dark input,
html.dark textarea,
html.dark select {
  @apply bg-gray-800 text-gray-100 border-gray-700;
}

html.dark input:focus,
html.dark textarea:focus,
html.dark select:focus {
  @apply border-primary-500 bg-gray-900;
}

html.dark input::placeholder {
  @apply text-gray-500;
}

/* Links in Dark Mode */
html.dark a {
  @apply text-primary-400 hover:text-primary-300;
}

/* Gradients work naturally in dark mode due to color selection */

/* Table Dark Mode */
html.dark table {
  @apply text-gray-100;
}

html.dark thead {
  @apply bg-gray-800 text-gray-100;
}

html.dark tbody tr {
  @apply border-gray-700;
}

html.dark tbody tr:hover {
  @apply bg-gray-800;
}

/* Badges in Dark Mode */
html.dark .badge-primary {
  @apply bg-primary-900 text-primary-200;
}

html.dark .badge-success {
  @apply bg-success-900 text-success-200;
}

html.dark .badge-warning {
  @apply bg-warning-900 text-warning-200;
}

html.dark .badge-error {
  @apply bg-error-900 text-error-200;
}

/* Code in Dark Mode */
html.dark code {
  @apply bg-gray-800 text-gray-100;
}

html.dark pre {
  @apply bg-gray-900 text-gray-100;
}

/* Scrollbar in Dark Mode */
html.dark ::-webkit-scrollbar-thumb {
  @apply bg-gray-700 hover:bg-gray-600;
}

html.dark ::-webkit-scrollbar-track {
  @apply bg-gray-900;
}
