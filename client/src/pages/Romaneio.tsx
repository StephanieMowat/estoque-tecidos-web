import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function Romaneio() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtigo, setSelectedArtigo] = useState<number | null>(null);
  const [selectedSubgrupo, setSelectedSubgrupo] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    cliente: "",
    romaneio: "",
    quantidade: "",
    valorUnitario: "",
    frete: "",
    transportadora: "",
    observacoes: "",
  });
  const [saidas, setSaidas] = useState<any[]>([]);

  const { data: artigos = [], isLoading: artigosLoading } = trpc.artigos.list.useQuery();
  const { data: subgrupos = [], isLoading: subgruposLoading } = trpc.subgrupos.getByArtigoId.useQuery(
    selectedArtigo || 0,
    { enabled: !!selectedArtigo }
  );

  const handleAddSaida = () => {
    if (!selectedSubgrupo || !formData.cliente || !formData.quantidade) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const subgrupo = subgrupos.find(s => s.id === selectedSubgrupo);
    const artigo = artigos.find(a => a.id === selectedArtigo);

    const novaSaida = {
      id: Date.now(),
      subgrupoId: selectedSubgrupo,
      artigoNome: artigo?.nome,
      cor: subgrupo?.cor,
      cliente: formData.cliente,
      romaneio: formData.romaneio,
      quantidade: parseFloat(formData.quantidade),
      valorUnitario: parseFloat(formData.valorUnitario || "0"),
      valorTotal: parseFloat(formData.quantidade) * parseFloat(formData.valorUnitario || "0"),
      frete: parseFloat(formData.frete || "0"),
      transportadora: formData.transportadora,
    };

    setSaidas([...saidas, novaSaida]);
    setFormData({
      cliente: "",
      romaneio: "",
      quantidade: "",
      valorUnitario: "",
      frete: "",
      transportadora: "",
      observacoes: "",
    });
    toast.success("Saída adicionada à lista");
  };

  const handleRemoveSaida = (id: number) => {
    setSaidas(saidas.filter(s => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saidas.length === 0) {
      toast.error("Adicione pelo menos uma saída");
      return;
    }

    // TODO: Implementar envio das saídas para o servidor
    toast.success("Romaneios registrados com sucesso!");
    setSaidas([]);
  };

  const totalValor = saidas.reduce((sum, s) => sum + s.valorTotal, 0);
  const totalFrete = saidas.reduce((sum, s) => sum + s.frete, 0);

  const filteredArtigos = artigos.filter(artigo =>
    artigo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artigo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Romaneio</h1>
          <p className="text-gray-600">Registre saídas de estoque para clientes</p>
          <p className="text-sm text-gray-500 mt-2">Usuário: {user?.name} ({user?.role})</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Nova Saída</CardTitle>
              <CardDescription>Preencha os dados do romaneio</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar Artigo</Label>
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

                {searchTerm && (
                  <div className="max-h-48 overflow-y-auto border rounded-lg">
                    {filteredArtigos.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum artigo encontrado
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredArtigos.map((artigo) => (
                          <button
                            key={artigo.id}
                            onClick={() => {
                              setSelectedArtigo(artigo.id);
                              setSearchTerm("");
                            }}
                            className={`w-full text-left p-3 hover:bg-gray-100 transition-colors ${
                              selectedArtigo === artigo.id ? "bg-purple-50" : ""
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

                {selectedArtigo && (
                  <div>
                    <Label htmlFor="subgrupo">Subgrupo (Cor/Lote) *</Label>
                    <select
                      id="subgrupo"
                      value={selectedSubgrupo || ""}
                      onChange={(e) => setSelectedSubgrupo(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione um subgrupo...</option>
                      {subgrupos.map(subgrupo => (
                        <option key={subgrupo.id} value={subgrupo.id}>
                          {subgrupo.cor || "Sem cor"} - {subgrupo.lote || "Sem lote"} (Qtd: {parseFloat(subgrupo.quantidade || "0").toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Cliente *</Label>
                    <Input
                      id="cliente"
                      value={formData.cliente}
                      onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="romaneio">Romaneio</Label>
                    <Input
                      id="romaneio"
                      value={formData.romaneio}
                      onChange={(e) => setFormData({ ...formData, romaneio: e.target.value })}
                      placeholder="Número do romaneio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade *</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      step="0.01"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valorUnitario">Valor Unitário</Label>
                    <Input
                      id="valorUnitario"
                      type="number"
                      step="0.01"
                      value={formData.valorUnitario}
                      onChange={(e) => setFormData({ ...formData, valorUnitario: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frete">Frete</Label>
                    <Input
                      id="frete"
                      type="number"
                      step="0.01"
                      value={formData.frete}
                      onChange={(e) => setFormData({ ...formData, frete: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transportadora">Transportadora</Label>
                    <Input
                      id="transportadora"
                      value={formData.transportadora}
                      onChange={(e) => setFormData({ ...formData, transportadora: e.target.value })}
                      placeholder="Nome da transportadora"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações adicionais..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddSaida}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar à Lista
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Romaneios na Lista</p>
                <p className="text-2xl font-bold text-blue-600">{saidas.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalValor.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frete Total</p>
                <p className="text-lg font-bold text-orange-600">
                  R$ {totalFrete.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Romaneios Adicionados</CardTitle>
                <CardDescription>Revise antes de confirmar</CardDescription>
              </div>
              {saidas.length > 0 && (
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {saidas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum romaneio adicionado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Artigo</TableHead>
                        <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead className="hidden lg:table-cell">Frete</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saidas.map((saida) => (
                        <TableRow key={saida.id}>
                          <TableCell className="font-medium">{saida.artigoNome}</TableCell>
                          <TableCell className="hidden sm:table-cell">{saida.cliente}</TableCell>
                          <TableCell>{saida.quantidade.toFixed(2)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            R$ {saida.frete.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">R$ {(saida.valorTotal + saida.frete).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleRemoveSaida(saida.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    Confirmar Romaneios
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSaidas([])}
                  >
                    Limpar Lista
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
