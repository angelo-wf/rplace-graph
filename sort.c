
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

uint8_t* readFile(const char* path, int* length, bool zTerm);

int comp(const void* el1, const void* el2) {
  uint32_t a = (*((uint64_t*) el1)) >> 32;
  uint32_t b = (*((uint64_t*) el2)) >> 32;
  if(a > b) return 1;
  if(a < b) return -1;
  return 0;
}

void sort(void) {
  int count = 0;
  uint64_t* data = (uint64_t*) readFile("data.bin", &count, false);
  count /= 8;
  printf("count: %d\n", count);
  puts("Sorting...");
  qsort(data, count, sizeof(uint64_t), comp);
  puts("Storing...");
  FILE* of = fopen("data.bin", "wb");
  fwrite(data, count * 8, 1, of);
  fclose(of);
}

int main(int argc, char** argv) {
  sort();
  return 0;
}

uint8_t* readFile(const char* path, int* length, bool zTerm) {
  FILE* f = fopen(path, zTerm ? "r" : "rb");
  if(f == NULL) {
    printf("Failed to read %s\n", path);
    return NULL;
  }
  fseek(f, 0, SEEK_END);
  size_t size = ftell(f);
  rewind(f);
  uint8_t* data = malloc(size + zTerm);
  fread(data, size, 1, f);
  fclose(f);
  if(zTerm) data[size] = '\0';
  *length = size + zTerm;
  return data;
}
