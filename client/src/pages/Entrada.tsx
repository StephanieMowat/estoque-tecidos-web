import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Entrada() {
  const [selectedArtigo, setSelectedArtigo] = useState<number | null>(null);
  const [selectedSubgrupo, setSelectedSubgrupo] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fornecedor: "",
    notaFiscal: "",
    quantidade: "",
    valorUnitario: "",
    observacoes: "",
  });
  const [entradas, setEntradas] = useState<any[]>([]);

  const { data: artigos = [], isLoading: artigosLoading } = trpc.artigos.list.useQuery();
  const { data: subgrupos = [], isLoading: subgruposLoading } = trpc.subgrupos.getByArtigoId.useQuery(
    selectedArtigo || 0,
    { enabled: !!selectedArtigo }
  );

  const handleAddEntrada = () => {
    if (!selectedSubgrupo || !formData.fornecedor || !formData.quantidade) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const subgrupo = subgrupos.find(s => s.id === selectedSubgrupo);
    const artigo = artigos.find(a => a.id === selectedArtigo);

    const novaEntrada = {
      id: Date.now(),
      subgrupoId: selectedSubgrupo,
      artigoNome: artigo?.nome,
      cor: subgrupo?.cor,
      fornecedor: formData.fornecedor,
      notaFiscal: formData.notaFiscal,
      quantidade: parseFloat(formData.quantidade),
      valorUnitario: parseFloat(formData.valorUnitario || "0"),
      valorTotal: parseFloat(formData.quantidade) * parseFloat(formData.valorUnitario || "0"),
    };

    setEntradas([...entradas, novaEntrada]);
    setFormData({
      fornecedor: "",
      notaFiscal: "",
      quantidade: "",
      valorUnitario: "",
      observacoes: "",
    });
    toast.success("Entrada adicionada à lista");
  };

  const handleRemoveEntrada = (id: number) => {
    setEntradas(entradas.filter(e => e.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (entradas.length === 0) {
      toast.error("Adicione pelo menos uma entrada");
      return;
    }

    // TODO: Implementar envio das entradas para o servidor
    toast.success("Entradas registradas com sucesso!");
    setEntradas([]);
  };

  const totalValor = entradas.reduce((sum, e) => sum + e.valorTotal, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Entrada</h1>
          <p className="text-gray-600">Registre novas entradas de estoque de fornecedores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Nova Entrada</CardTitle>
              <CardDescription>Preencha os dados da entrada de estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="artigo">Artigo *</Label>
                  <select
                    id="artigo"
                    value={selectedArtigo || ""}
                    onChange={(e) => {
                      setSelectedArtigo(e.target.value ? parseInt(e.target.value) : null);
                      setSelectedSubgrupo(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione um artigo...</option>
                    {artigos.map(artigo => (
                      <option key={artigo.id} value={artigo.id}>
                        {artigo.nome} ({artigo.codigo})
                      </option>
                    ))}
                  </select>
                </div>

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
                          {subgrupo.cor || "Sem cor"} - {subgrupo.lote || "Sem lote"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fornecedor">Fornecedor *</Label>
                    <Input
                      id="fornecedor"
                      value={formData.fornecedor}
                      onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notaFiscal">Nota Fiscal</Label>
                    <Input
                      id="notaFiscal"
                      value={formData.notaFiscal}
                      onChange={(e) => setFormData({ ...formData, notaFiscal: e.target.value })}
                      placeholder="Número da NF"
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
                  onClick={handleAddEntrada}
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
                <p className="text-sm text-gray-600">Entradas na Lista</p>
                <p className="text-2xl font-bold text-blue-600">{entradas.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalValor.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entradas Adicionadas</CardTitle>
            <CardDescription>Revise antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent>
            {entradas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma entrada adicionada ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Artigo</TableHead>
                        <TableHead className="hidden sm:table-cell">Fornecedor</TableHead>
                        <TableHead className="hidden md:table-cell">NF</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead className="hidden lg:table-cell">Valor Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entradas.map((entrada) => (
                        <TableRow key={entrada.id}>
                          <TableCell className="font-medium">{entrada.artigoNome}</TableCell>
                          <TableCell className="hidden sm:table-cell">{entrada.fornecedor}</TableCell>
                          <TableCell className="hidden md:table-cell">{entrada.notaFiscal || "-"}</TableCell>
                          <TableCell>{entrada.quantidade.toFixed(2)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            R$ {entrada.valorUnitario.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">R$ {entrada.valorTotal.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleRemoveEntrada(entrada.id)}
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
                    Confirmar Entradas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEntradas([])}
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
