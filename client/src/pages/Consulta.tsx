import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download } from "lucide-react";

export default function Consulta() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtigo, setSelectedArtigo] = useState<number | null>(null);

  const { data: artigos = [], isLoading: artigosLoading } = trpc.artigos.list.useQuery();
  const { data: subgrupos = [], isLoading: subgruposLoading } = trpc.subgrupos.getByArtigoId.useQuery(
    selectedArtigo || 0,
    { enabled: !!selectedArtigo }
  );

  const filteredArtigos = artigos.filter(artigo =>
    artigo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artigo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEstoque = subgrupos.reduce((sum, sub) => {
    const quantidade = parseFloat(sub.quantidade || "0");
    return sum + quantidade;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consulta de Estoque</h1>
          <p className="text-gray-600">Visualize o estoque disponível em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Selecionar Artigo</CardTitle>
              <CardDescription>Busque o artigo que deseja consultar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar por nome ou código</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Digite o nome ou código do artigo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {artigosLoading ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Carregando artigos...</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto border rounded-lg">
                    {filteredArtigos.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum artigo encontrado
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredArtigos.map((artigo) => (
                          <button
                            key={artigo.id}
                            onClick={() => setSelectedArtigo(artigo.id)}
                            className={`w-full text-left p-3 hover:bg-gray-100 transition-colors ${
                              selectedArtigo === artigo.id ? "bg-purple-50 border-l-4 border-l-purple-600" : ""
                            }`}
                          >
                            <div className="font-medium">{artigo.nome}</div>
                            <div className="text-sm text-gray-600">{artigo.codigo}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedArtigo ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Artigo Selecionado</p>
                    <p className="font-medium">
                      {artigos.find(a => a.id === selectedArtigo)?.nome}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total em Estoque</p>
                    <p className="text-2xl font-bold text-purple-600">{totalEstoque.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subgrupos</p>
                    <p className="text-lg font-medium">{subgrupos.length}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Selecione um artigo para ver o resumo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedArtigo && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Detalhes do Estoque</CardTitle>
                  <CardDescription>Subgrupos e quantidades disponíveis</CardDescription>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subgruposLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Carregando subgrupos...</p>
                </div>
              ) : subgrupos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum subgrupo cadastrado para este artigo</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cor</TableHead>
                        <TableHead className="hidden sm:table-cell">Lote</TableHead>
                        <TableHead className="hidden md:table-cell">Metragem</TableHead>
                        <TableHead className="hidden lg:table-cell">Localização</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subgrupos.map((subgrupo) => (
                        <TableRow key={subgrupo.id}>
                          <TableCell className="font-medium">{subgrupo.cor || "-"}</TableCell>
                          <TableCell className="hidden sm:table-cell">{subgrupo.lote || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {subgrupo.metragem ? `${parseFloat(subgrupo.metragem).toFixed(2)} MTS` : "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{subgrupo.localizacao || "-"}</TableCell>
                          <TableCell className="text-right font-medium">
                            {parseFloat(subgrupo.quantidade || "0").toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-50 font-bold">
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">{totalEstoque.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
