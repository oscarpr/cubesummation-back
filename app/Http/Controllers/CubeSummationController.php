<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CubeSummationController extends Controller {

    public function makeOperation(Request $request) {
        $content = preg_split('[\n]', trim($request->getContent()));

        if (count($content) >= 1) {
            $T = $this->lineValue(0, $content[0], 1, '\s');
            if (!$this->isValid($T, 1, 50)) {
                return 'Test case number is not valid';
            }

            $testcases = $this->extractTestCases($content, $T);
            if (is_string($testcases)) {
                return $testcases;
            }

            $values = '';
            forEach ($testcases as $index => $testcase) {
                $values = $values .  ' ' . $this->resolveTestCase($testcase);
            }
            $response = preg_replace('/\s/', ' ', trim($values));
            return $response;
        } else {

            return 'SyntaxError';
        }
    }

    private function isValid($val, $initial, $final) {
        return is_numeric($val) && $initial <= $val && $val <= $final;
    }

    private function getParameters($line) {
        $line = trim($line);
        $N = $this->lineValue(0, $line, 2, '[\s]+');
        $M = $this->lineValue(1, $line, 2, '[\s]+');

        if ($N == null || $M == null) {
            return [-1, -1];
        }

        $N = $this->isValid($N, 1, 100) ? $N : null;
        $M = $this->isValid($M, 1, 1000) ? $M : null;

        return [$N, $M];
    }

    private function lineValue($position, $line, $length, $splitBy) {
        $digits = preg_split('/' . $splitBy . '/', trim($line));
        if (count($digits) == $length) {
            return $digits[$position];
        } else {
            return null;
        }
    }

    private function extractTestCases($content, $T) {
        array_splice($content, 0, 1);

        $testcases = array();
        $testcase = array();

        foreach ($content as $index => $line) {
            if ((preg_match('[^\d+\s\d+$]', $line) && count($testcase) > 0)) {
                array_push($testcases, $testcase);
                $testcase = array();
            }
            array_push($testcase, $line);

            $isLast = ($index + 1) == count($content);
            if ($isLast) {
                array_push($testcases, $testcase);
            }
        }
        return count($testcases) == $T ? $testcases : ((count($testcases) > $T) ? 'Missing testcases' : 'Extra testcases');
    }

    private function resolveTestCase($testcase) {
        list($N, $M) = $this->getParameters($testcase[0]);
        if ($N == null) {
            return 'Matrix size must be number and between 1 and 100';
        }

        if ($N == -1 && $M == -1) {
            return 'Extraparameters';
        }

        if ($M == null) {
            return 'Number of operations must be number and between 1 and 1000';
        }

        if ($M != (count($testcase) - 1)) {
            return $M < (count($testcase) - 1) ? 'Extra operations' : 'Missing Operations';
        }

        $matrix = $this->createMatrix($N);

        unset($testcase[0]);
        $value = '';
        foreach ($testcase as $index => $query) {

            $querytype = $this->lineValue(0, $query, 2, '[^\d][\s]');
            $querytype = $querytype == 'UPDAT' ? $querytype . 'E' : $querytype . 'Y';

            $queryoperation = $this->lineValue(1, $query, 2, '[^\d][\s]');

            if ($querytype == null || $queryoperation == null) {
                return 'Invalid parameters';
            }

            if ($querytype == 'UPDATE') {
                $matrix = $this->resolveUpdate($queryoperation, $matrix);
            } elseif ($querytype == 'QUERY') {
                $value = $value . ' ' . $this->resoleQuery($queryoperation, $matrix);
            } else {
                return 'Inalid query type';
            }
        }
        return $value;
    }

    public function createMatrix($N) {
        return (array_fill(0, $N, array_fill(0, $N, array_fill(0, $N, 0))));
    }

    public function resolveUpdate($queryoperation, $matrix) {
        $matrixsize = count($matrix[0]);
        if (preg_match('/^([\d]+\s){3}([\d,?.?]+){1}$/', $queryoperation)) {
            $digits = explode(' ', $queryoperation);
            $W;
            for ($i = 0; $i < count($digits); $i++) {
                if ($i == (count($digits) - 1)) {
                    $W = $digits[$i];
                    if (!$this->isValid($digits[$i], pow(10, -9), pow(10, 9))) {
                        return 'W must be a number and between 10^⁻9 and 10⁻9';
                        break;
                    }
                } else if ($digits[$i] > $matrixsize || $digits[$i] == 0) {
                    return $digits[$i] . ' can not be 0 or greater than ' . $matrixsize;
                }
            }

            list($x, $y, $z) = $digits;
            $matrix[$x - 1][$y - 1][$z - 1] = $W;
            return $matrix;
        }

        return 'Invalid operation format';
    }

    public function resoleQuery($queryoperation, $matrix) {
        $matrixsize = count($matrix[0]);

        if (preg_match('/^([\d]+\s){5}\d+$/', $queryoperation)) {

            $digits = explode(' ', $queryoperation);

            for ($i = 0; $i < (count($digits) / 2); $i++) {

                if ($digits[$i] > $digits[$i + 3]) {
                    return $digits[$i] . ' Can not be greater than ' . $digits[$i + 3];
                }

                if ($digits[$i] > $matrixsize) {
                    return $digits[$i] . ' Can not be greater than ' . $matrixsize;
                }

                if ($digits[$i + 3] > $matrixsize) {
                    return $digits[$i + 3] . ' Can not be greater than ' . $matrixsize;
                }
            }

            $value = 0;
            for ($i = $digits[0] - 1; $i < $digits[3]; $i++) {
                for ($j = $digits[1] - 1; $j < $digits[4]; $j++) {
                    for ($k = $digits[2] - 1; $k < $digits[5]; $k++) {
                        $value += +$matrix[$i][$j][$k];
                    }
                }
            }
            return $value;
        }
    }

}
